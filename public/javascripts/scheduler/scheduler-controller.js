'use strict'

Application.Controllers.controller('SchedulerController', function ($scope, $http, $cookies, $dialog, $timeout, SchedulerObjects, $routeParams) {
  var resourcePath = $routeParams.festivalGroupId + "/" + $routeParams.festivalId;

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

  // user options
  $scope.groupByVenue = false;
  $scope.selectedAllTimes = false;

  // Get objects from data
  SchedulerObjects.then(function(objects) {
    $scope.venues = objects.venues;
    $scope.shows = objects.shows;
    $scope.days = objects.days;
    $scope.timesOfDay = objects.timesOfDay;
    $scope.times = objects.timeSlots;
    $scope.showings = objects.showings;

    tryLoadingSelections();
  });

  // load selections from server or localStorage, if available
  var tryLoadingSelections = function() {
    if ($scope.loggedIn && $scope.hasData) {
      $scope.loadSelectionsFromServer();
    } else if (Modernizr.localstorage && localStorage[resourcePath + "/selections"]) {
      var data = JSON.parse(localStorage[resourcePath + "/selections"]);

      assignSelectionsFromData(
        data.selectedShowIds,
        data.selectedTimeIds,
        data.selectedShowingIds);
    }
  };

  $scope.saveSelectionsToLocalStorage = function() {
    var data = getSelectionsAsDataObject();
    localStorage[resourcePath + "/selections"] = JSON.stringify(data);
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

	$scope.checkAllTimes = function() {
		angular.forEach($scope.times, function(time) {
			if ($scope.selectedAllTimes) {
				time.select();
			} else {
				time.deselect();
			}
		})
	};

  var userId = function() {
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

  var getSelectedIds = function(list) {
    var selectedIds = list
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
    var data = new Object();
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
