var selectorApp = angular.module('selectorApp', ['ngCookies', 'ui.bootstrap']);

selectorApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/home',
      {
        controller: 'HomeController',
        templateUrl: 'views/home.html'
      })
    .otherwise({ redirectTo: '/home' });
});

selectorApp.filter('titleFilter', function() {
  return function(list, title) {
    if (!title || title == "") { return list; }
    var resultList = list.filter(function(item) {
      return item.title.toLowerCase().indexOf(title.toLowerCase()) != -1;
    });
    return resultList;
  };
});

selectorApp.factory('objectExtractor', function($q, $http) {
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
      showData = result[0];
      venues = result[1];
      shows = showData.map(function(datum) {
        venue = findById(venues, datum.venue_id);
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
        id = datum.id;
        time = findById(timeSlots, datum.timeslot);
        show = findById(shows, datum.show_id);
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

selectorApp.controller('HomeController', function ($scope, $http, $cookies, $dialog, $timeout, $q, objectExtractor) {

  // Properties

  $scope.userName = $cookies.user_name;
  $scope.loggedIn = ($cookies.logged_in === "true");
  $scope.hasData = ($cookies.has_data === "true");

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

  $scope.shows = [];
  $scope.times = [];
  $scope.days = [];
  $scope.timesOfDay = [];
  $scope.showings = [];
  var showsLoaded = false;
  var timesLoaded = false;

  // Get objects from data
  var objectsPromise = objectExtractor;
  objectsPromise.then(function(objects) {
    $scope.venues = objects.venues;
    $scope.shows = objects.shows;
    $scope.days = objects.days;
    $scope.timesOfDay = objects.timesOfDay;
    $scope.times = objects.timeSlots;
    $scope.showings = objects.showings;


    tryLoadingSelections();
  });

  // Show selection
  $scope.groupByVenue = false;

  // load selections from server or localStorage, if available
  var tryLoadingSelections = function() {
    if ($scope.loggedIn && $scope.hasData) {
      $scope.loadSelectionsFromServer();
    } else if (Modernizr.localstorage && localStorage["selectionData"]) {
      var data = JSON.parse(localStorage["selectionData"]);

      assignSelectionsFromData(
        data.selectedShowIds,
        data.selectedTimeIds,
        data.selectedShowingIds);
    }
  };

  $scope.saveSelectionsToLocalStorage = function() {
    var data = getSelectionsAsDataObject();
    localStorage["selectionData"] = JSON.stringify(data);
  };


  // Methods

  $scope.toggleSelectShow = function(show) {
    show.invertSelection();
    $scope.saveSelectionsToLocalStorage();
  };

  $scope.toggleSelectTime = function(time) {
    time.invertSelection();
    $scope.saveSelectionsToLocalStorage();
  };

  $scope.toggleSelectShowing = function(showing) {
    showing.invertSelection();
    $scope.saveSelectionsToLocalStorage();
  };

  userId = function() {
    return $cookies.uid;
  };

  // load user data
  $scope.loadSelectionsFromServer = function() {
    // if not logged in, no work to be done (shouldn't ever have this situation)
    
    // if logged in, attempt to get selection data from server
    $http.get('user_data/' + userId())
      .success(function(data) {
        // data validation?
        if (typeof data !== "object") {
          addAlert("Failed to load selections.", "error");
          return
        }
  
        assignSelectionsFromData(
          data.selectedShowIds,
          data.selectedTimeIds,
          data.selectedShowingIds);
  
      })
      .error(function(){
        addAlert("Failed to load selections.", "error");
      });
  };

  var assignSelectionsFromData = function(
    selectedShowIds,
    selectedTimeIds,
    selectedShowingIds)
  {
    // clear all current selections
    $scope.times.forEach(function(time) { time.deselect(); });
    $scope.shows.forEach(function(show) { show.deselect(); });
    $scope.showings.forEach(function(showing) { showing.deselect(); });

    // select shows, times, and showtimes according to ids
    selectedShowIds.forEach(function(showId) {
      var show = findById($scope.shows, showId);
      show.select();
    });

    selectedTimeIds.forEach(function(timeId) {
      var time = findById($scope.times, timeId);
      time.select();
    });

    selectedShowingIds.forEach(function(showingId) {
      var showing = findById($scope.showings, showingId);
      showing.select();
    });

    // add alert to let user know data was fetched
    addAlert("Selections successfully loaded.", "success");
  };

  getSelectedIds = function(list) {
    selectedIds = list
      .filter(function(element) { return element.selected })
      .map(function(element) { return element.id });
    return selectedIds;
  };

  var addAlert = function(message, type) {
    var newAlert = { type: type, msg: message };
    $scope.alerts.push(newAlert);
    $timeout(function() {
      var index = $scope.alerts.indexOf(newAlert);
      $scope.closeAlert(index);
    }, 3000);
  };

  $scope.alerts = [];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  var getSelectionsAsDataObject = function() {
    var data = new Object();
    data.selectedShowIds = getSelectedIds($scope.shows);
    data.selectedTimeIds = getSelectedIds($scope.times);
    data.selectedShowingIds = getSelectedIds($scope.showings);

    return data;
  };

  // save user data
  $scope.saveSelectionsToServer = function() {
    var data = getSelectionsAsDataObject();
    $http.put('user_data/' + userId(), data)
      .success(function(){
        addAlert("Selections saved successfully", "success");
      })
      .error(function(){
        addAlert("Unable to save selections.", "error");
      });
  };

  $scope.logout = function() {
    data = new Object();
    data.uid = userId();

    $cookies.user_name = null;
    $scope.username = null;
    $cookies.uid = null;
    $scope.uid = null;
    $cookies.logged_in = false;
    $scope.loggedIn = false;
    $http.post('logout', data);
  };

});
