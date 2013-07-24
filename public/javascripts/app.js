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

selectorApp.controller('HomeController', function ($scope, $http, $cookies, $dialog, $timeout) {

  // Properties

  $scope.userName = $cookies.user_name;
  $scope.loggedIn = ($cookies.logged_in === "true");
  $scope.hasData = ($cookies.has_data === "true");

  // Venues
  $http.get('data/2013/venues.json').success(function(data) {
    $scope.venues = data.map(function(datum) {
      return new Venue(datum.id, datum.name);
    });
    loadShows();
  });

  // Show selection
  $scope.groupByVenue = false;
  $scope.shows = [];
  var showsLoaded = false;

  var loadShows = function() {
    $http.get('data/2013/shows.json').success(function(data) {
      $scope.shows = data.map(function(datum) {
        venue = $scope.venues.filter(function(venue) {
          return venue.id === datum.venue_id;
        })[0];
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
          time = $scope.times.filter(function(time) { return time.id === showing_data.timeslot } )[0];
          show = $scope.shows.filter(function(show) { return show.id === showing_data.show_id } )[0];
          return {id: id, show: show, time: time, selected: false, selectable: true}
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

  $scope.relevant_showings = [];

  $scope.selected_showings = [];
  $scope.selectable_showings = [];

  // Methods

  var deselectForbiddenShowings = function() {
    $scope.showings.forEach(function(showing) {
      if (showing.selected) {
        // if the showing's time or show is deselected, need to deselect the showing as well
        if (!showing.show.selected || !showing.time.selected) {
          $scope.deselectShowing(showing);
        };
      };
    });
  };

  $scope.refresh_relevant_showings = function() {
    deselectForbiddenShowings();
    $scope.relevant_showings = $scope.showings.filter(function(showing) {
      return showing.show.selected && showing.time.selected
    });
    $scope.refresh_relevant_showings_selectable();
  };

  $scope.refresh_relevant_showings_selectable = function() {
    $scope.selectable_showings = [];
    $scope.relevant_showings.forEach(function(showing) {
      if (showing.selected) {
        showing.selectable = false;
      } else {
        // check for selected showings with same time
        selected_showings_with_same_time = $scope.selected_showings.filter(function(selected_showing) {
          return selected_showing.time === showing.time });
        showing_with_same_time_exists = selected_showings_with_same_time.length !== 0;

        // check for show already selected if user wants to see shows only once
        selected_showings_with_same_show = $scope.selected_showings.filter(function(selected_showing) {
          return selected_showing.show === showing.show });
        showing_with_same_show_exists = selected_showings_with_same_show.length !== 0;

        if ($scope.limit_one_showing_per_show) {
          forbidden = showing_with_same_time_exists || showing_with_same_show_exists
        } else {
          forbidden = showing_with_same_time_exists
        };

        showing.selectable = !forbidden
        if (showing.selectable) {
          $scope.selectable_showings.push(showing);
        };
      };
    });
    refreshShowingGroups();
    $scope.saveSelectionsToLocalStorage();
  };

  // Selection
  var assign_selection = function(targetElement, list, value) {
    list.forEach(function(element) {
      if (element == targetElement) {
        element.selected = value;
      };
    });
  };

  var toggleSelection = function(targetElement, list) {
    list.forEach(function(element) {
      if (element == targetElement) {
        element.selected = !element.selected;
      };
    });
  };

  var assignSelectionAll = function(list, value) {
    list.forEach(function(element) {
      element.selected = value;
    });
  };

  var assignSelectionById = function(id, list, value) {
    list.forEach(function(element) {
      if (element.id === id) {
        element.selected = value;
      };
    });
  };

  // Show selection
  $scope.refresh_show_selections = function() {
    $scope.refresh_relevant_showings();
    $scope.saveSelectionsToLocalStorage();
  };

  $scope.toggleSelectShow = function(show) {
    toggleSelection(show, $scope.shows);
    $scope.refresh_show_selections();
  };

  $scope.selectShow = function(show) {
    assign_selection(show, $scope.shows, true);
    $scope.refresh_show_selections();
  };

  $scope.deselectShow = function(show) {
    assign_selection(show, $scope.shows, false);
    $scope.refresh_show_selections();
  };


  // Time selection
  $scope.refresh_time_selections = function() {
    $scope.selected_times = $scope.times.filter(function(time) { return time.selected } );
    $scope.unselected_times = $scope.times.filter(function(time) { return !time.selected } );
    $scope.refresh_relevant_showings();
    $scope.saveSelectionsToLocalStorage();
  };

  $scope.selectTime = function(time) {
    assign_selection(time, $scope.times, true);
    $scope.refresh_time_selections();
  };

  $scope.deselectTime = function(time) {
    assign_selection(time, $scope.times, false);
    $scope.refresh_time_selections();
  };

  $scope.toggleSelectTime = function(time) {
    toggleSelection(time, $scope.times);
    $scope.refresh_time_selections();
  };


  // Showing selection
  $scope.selectShowing = function(showing) {
    var selectedIndex = $scope.selected_showings.indexOf(showing);
    // only add to selected list if not already included
    if (selectedIndex === -1) {
      showing.selected = true;
      $scope.selected_showings.push(showing)
      $scope.refresh_relevant_showings_selectable();
    };
  };

  $scope.deselectShowing = function(showing) {
    var selectedIndex = $scope.selected_showings.indexOf(showing);
    $scope.selected_showings.splice(selectedIndex,1);

    // find show in original list and mark as unselected
    var showingsIndex = $scope.showings.indexOf(showing);
    $scope.showings[showingsIndex].selected = false;
    $scope.refresh_relevant_showings_selectable();
  };

  $scope.toggleSelectShowing = function(showing) {
    if (showing.selected) {
      $scope.deselectShowing(showing);
    } else {
      $scope.selectShowing(showing);
    }
    $scope.refresh_relevant_showings_selectable();
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
    assignSelectionAll($scope.times, false);
    assignSelectionAll($scope.shows, false);

    // this is a workaround to make sure appropriate showing lists are updated
    $scope.showings.forEach(function(showing) {
      $scope.deselectShowing(showing);
    });

    // select shows, times, and showtimes according to ids
    selectedShowIds.forEach(function(showId) {
      assignSelectionById(showId, $scope.shows, true);
    });

    selectedTimeIds.forEach(function(timeId) {
      assignSelectionById(timeId, $scope.times, true);
    });

    selectedShowingIds.forEach(function(showingId) {
      // showings are inconsistent - this is a workaround to make sure appropriate
      // lists are being updated
      showing = $scope.showings.filter(function(showing) {
        return showing.id === showingId
      })[0];
      $scope.toggleSelectShowing(showing);
    });

    // refresh selection lists
    $scope.refresh_show_selections();
    $scope.refresh_time_selections();
    $scope.refresh_relevant_showings_selectable();

    // add alert to let user know data was fetched
    addAlert("Selections successfully loaded.", "success");
  };

  getSelectedIds = function(list) {
    selectedIds = list
      .filter(function(show) { return show.selected })
      .map(function(show) { return show.id });
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
