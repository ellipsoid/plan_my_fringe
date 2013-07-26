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
  var deferredVenues = $q.defer();

  $http.get('data/2013/venues.json').success(function(data) {
    var venues = data.map(function(datum) {
      return new Venue(datum.id, datum.name);
    });
    deferredVenues.resolve(venues);
  }).error(function(reason) {
    deferredVenues.reject(reason);
  });

  return deferredVenues.promise;
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

//  // Venues
//  $http.get('data/2013/venues.json').success(function(data) {
//    $scope.venues = data.map(function(datum) {
//      return new Venue(datum.id, datum.name);
//    });
//    loadShows();
//  });

  // Venues
  var venuesPromise = objectExtractor;
  venuesPromise.then(function(venues) {
    $scope.venues = venues;
    loadShows();
  });

  // Show selection
  $scope.groupByVenue = false;
  $scope.shows = [];
  var showsLoaded = false;

  var loadShows = function() {
    $http.get('data/2013/shows.json').success(function(data) {
      $scope.shows = data.map(function(datum) {
        venue = findById($scope.venues, datum.venue_id);
        return new Show(datum.id, datum.title, venue)
      });
      // let showings know that shows are loaded
      showsLoaded = true;
      tryLoadShowings();
    });
  };

  // Time selection
  $scope.times = [];
  $scope.days = [];
  $scope.timesOfDay = [];
  var timesLoaded = false;

  $http.get('data/2013/timeslots.json').success(function(data) {
    data.forEach(function(datum) {
      var datetime = new Date(datum.datetime);
      var day;
      var timeOfDay;

      var matchingDays = $scope.days.filter(function(existingDay) {
        return existingDay.includes(datetime);
      });
      if (matchingDays.length != 0) {
        day = matchingDays[0];
      } else {
        day = new Day(datetime);
        $scope.days.push(day);
      }

      var matchingTimesOfDay = $scope.timesOfDay.filter(function(existingTime) {
        return existingTime.includes(datetime);
      });
      if (matchingTimesOfDay.length != 0) {
        timeOfDay = matchingTimesOfDay[0];
      } else {
        timeOfDay = new TimeOfDay(datetime);
        $scope.timesOfDay.push(timeOfDay);
      }

      var timeSlot = new TimeSlot(datum.id, day, timeOfDay);
      timeSlot.select(); // time slots selected by default
      $scope.times.push(timeSlot);
    });

    // let showings know that times are loaded
    timesLoaded = true;
    tryLoadShowings();
  });


  // Showing selection
  $scope.showings = [];

  var tryLoadShowings = function() {
    // only attempt to create showings once shows and times are both loaded
    if (showsLoaded && timesLoaded) {
      $http.get('data/2013/showings.json').success(function(data) {
        $scope.showings = data.map(function(showing_data) {
          id = showing_data.id;
          time = findById($scope.times, showing_data.timeslot);
          show = findById($scope.shows, showing_data.show_id);
          return new Showing(id, show, time);
        });
        tryLoadingSelections();
      });
    }
  };

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
