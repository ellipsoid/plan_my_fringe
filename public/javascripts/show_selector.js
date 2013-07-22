var selectorApp = angular.module('selectorApp', ['ngCookies', 'ui.bootstrap']);

selectorApp.directive('tabs', tabsDirective);

selectorApp.directive('pane', paneDirective);

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

  var getGroups = function(collection, keyFunction) {
    var groups = [];
    collection.forEach(function(element) {
      var key = keyFunction(element);

      // get groups for key - should be 0 or 1 group
      var groupsForKey = groups.filter(function(group) {
        return group.key === key
      });

      var group;
      if (groupsForKey.length == 0) {
        group = new Object();
        group.key = key;
        group.elements = [];
        groups.push(group);
        group.open = true; // groups should default to open
      } else {
        group = groupsForKey[0];
      };

      group.elements.push(element);
    });

    return groups;
  };

  // Properties

  $scope.userName = $cookies.user_name;
  $scope.loggedIn = ($cookies.logged_in === "true");
  $scope.hasData = ($cookies.has_data === "true");

  // Venues
  $http.get('data/2013/venues.json').success(function(data) {
    $scope.venues = data;
    loadShows();
  });

  // Show selection
  $scope.groupByVenue = false;
  $scope.shows = [];
  var showsLoaded = false;
  $scope.showGroups = [];

  var setShowGroups = function() {
    var groups = getGroups($scope.shows, function(show) {
      return show.venue;
    });

    $scope.showGroups = groups.map(function(rawGroup) {
      var showGroup = new Object();
      showGroup.venue = rawGroup.key;
      showGroup.venueName = showGroup.venue.name;
      showGroup.shows = rawGroup.elements;
      return showGroup;
    });
  };

  var loadShows = function() {
    $http.get('data/2013/shows.json').success(function(data) {
      $scope.shows = data.map(function(item) {
        venue = $scope.venues.filter(function(venue) {
          return venue.id === item.venue_id;
        })[0];
        return new ShowOption(item.id, item.title, venue)
      });
      // let showings know that shows are loaded
      showsLoaded = true;
      tryLoadShowings();
  
      setShowGroups();
    });
  };

  // Time selection
  $scope.times = [];
  var timesLoaded = false;
  $scope.timeGroups = [];

  var setTimeGroups = function() {
    var groups = getGroups($scope.times, function(time) {
      var calendarDate = new Date(time.date.getFullYear(), time.date.getMonth(), time.date.getDate());
      return calendarDate.getTime();
    });

    $scope.timeGroups = groups.map(function(rawGroup) {
      var timeGroup = new Object();
      timeGroup.date = new Date(rawGroup.key);
      timeGroup.dateString = timeGroup.date.toDateString();
      timeGroup.options = rawGroup.elements;
      timeGroup.open = true;
      return timeGroup;
    });
  };

  $http.get('data/2013/timeslots.json').success(function(data) {
    $scope.times = data;
    $scope.times.forEach(function(time) {
      time.selected = true;
      time.date = new Date(time.datetime);
      time.dateString = time.date.toLocaleDateString();
      time.timeString = time.date.toLocaleTimeString().replace(":00", "");
    });
    $scope.selected_times = $scope.times.slice(0);
    // let showings know that times are loaded
    timesLoaded = true;
    tryLoadShowings();

    setTimeGroups();
  });

  // use a copy of times array
  $scope.selected_times = [];
  $scope.unselected_times = [];

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

  var refreshShowingGroups = function() {
    var displayedShowings = $scope.selected_showings.concat($scope.selectable_showings);
    var timeGroups = getGroups(displayedShowings, function(showing) {
      var timestamp = showing.time.date;
      return timestamp.getTime();
    });

    // convert to a more user-friendly format
    timeGroups = timeGroups.map(function(rawGroup) {
      var timeGroup = new Object();
      timeGroup.time = new Date(rawGroup.key);
      timeGroup.timeString = timeGroup.time.toLocaleTimeString().replace(":00","");
      timeGroup.showings = rawGroup.elements;
      return timeGroup;
    });

    // group timeGroups by date
    var dateGroups = getGroups(timeGroups, function(timeGroup) {
      var time = timeGroup.time;
      // strip away time of day information and compare only by date
      var calendarDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
      return calendarDate.getTime();
    });

    // convert to a more user-friendly format
    dateGroups = dateGroups.map(function(rawGroup) {
      var dateGroup = new Object();
      dateGroup.date = new Date(rawGroup.key);
      dateGroup.dateString = dateGroup.date.toDateString();
      dateGroup.timeGroups = rawGroup.elements;
      return dateGroup;
    });

    $scope.showingGroups = dateGroups;
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
