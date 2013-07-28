'use strict'

Application.Services.factory('SchedulerObjects', function($q, $http) {
  var errorHandler = function(error) {
    return error;
  };

  var findById = function(list, id) {
    var matchingElements = list.filter(function(element) {
      return element.id == id;
    });

    if (matchingElements.length != 0) {
      return matchingElements[0];
    } else {
      return undefined;
    }
  };

  var venuesPromise = $http.get('data/2013/venues.json').then(
    function(result) {
      var venues = result.data.map(function(datum) {
        return new Venue(datum.id, datum.name);
      });
      return venues;
    },
    errorHandler
  );

  var showsDataPromise = $http.get('data/2013/shows.json').then(
    function(result) {
      return result.data;
    },
    errorHandler
  );

  var showsPromise = $q.all([showsDataPromise, venuesPromise]).then(
    function(result) {
      var showData = result[0];
      var venues = result[1];
      var shows = showData.map(function(datum) {
        var venue = findById(venues, datum.venue_id);
        return new Show(datum.id, datum.title, venue)
      });
      return shows;
    },
    errorHandler
  );

  var timeObjectsPromise = $http.get('data/2013/timeslots.json').then(
    function(result) {
      var days = [];
      var timesOfDay = [];
      var timeSlots = [];

      result.data.forEach(function(datum) {
        var datetime = new Date(datum.datetime);
        var day;
        var timeOfDay;
  
        // get day
        var matchingDays = days.filter(function(existingDay) {
          return existingDay.includes(datetime);
        });

        if (matchingDays.length != 0) {
          day = matchingDays[0];
        } else {
          day = new Day(datetime);
          days.push(day);
        }
  
        // get time of day
        var matchingTimesOfDay = timesOfDay.filter(function(existingTime) {
          return existingTime.includes(datetime);
        });
        if (matchingTimesOfDay.length != 0) {
          timeOfDay = matchingTimesOfDay[0];
        } else {
          timeOfDay = new TimeOfDay(datetime);
          timesOfDay.push(timeOfDay);
        }
  
        // get time slot
        var timeSlot = new TimeSlot(datum.id, day, timeOfDay);
        timeSlot.select(); // time slots are selected by default
        timeSlots.push(timeSlot);
      });

      return {
        days: days,
        timesOfDay: timesOfDay,
        timeSlots: timeSlots
      }
    },
    errorHandler
  );

  var showingsDataPromise = $http.get('data/2013/showings.json').then(
    function(result) {
      return result.data;
    },
    errorHandler
  );

  var showingsPromise = $q.all([showingsDataPromise, showsPromise, timeObjectsPromise]).then(
    function(result) {
      var showingsData = result[0];
      var shows = result[1];
      var timeSlots = result[2].timeSlots;
  
      var showings = showingsData.map(function(datum) {
        var id = datum.id;
        var time = findById(timeSlots, datum.timeslot);
        var show = findById(shows, datum.show_id);
        return new Showing(id, show, time);
      });
  
      return showings;
    }
  );

  var objectsPromise = $q.all([venuesPromise, showsPromise, timeObjectsPromise, showingsPromise]).then(
    function(result) {
      var timeObjects = result[2];
      var objects = {
        venues: result[0],
        shows: result[1],
        days: timeObjects.days,
        timesOfDay: timeObjects.timesOfDay,
        timeSlots: timeObjects.timeSlots,
        showings: result[3]
      };
  
      return objects;
    }
  );

  return objectsPromise;
});
