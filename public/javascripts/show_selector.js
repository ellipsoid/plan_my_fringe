var selectorApp = angular.module('selectorApp', []);

selectorApp.directive('tabs', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: function($scope, $element) {
      var panes = $scope.panes = [];

      $scope.select = function(pane) {
        angular.forEach(panes, function(pane) {
          pane.selected = false;
        });
        pane.selected = true;
      }

      this.addPane = function(pane) {
        if (panes.length == 0) $scope.select(pane);
        panes.push(pane);
      }
    },
    template:
      '<div class="tabbable">' + 
        '<ul class="nav nav-tabs">' + 
          '<li data-ng-repeat="pane in panes" data-ng-class="{active:pane.selected}">' +
            '<a href="" data-ng-click="select(pane)">{{pane.title}}</a>' +
          '</li>' + 
        '</ul>' + 
        '<div class="tab-content" data-ng-transclude></div>' + 
      '</div>',
    replace: true
  };
});

selectorApp.directive('pane', function() {
  return {
    require: '^tabs',
    restrict: 'E',
    transclude: true,
    scope: { title: '@' },
    link: function(scope, element, atrs, tabsController) {
      tabsController.addPane(scope);
    },
    template:
      '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
      '</div>',
    replace: true
  };
});

selectorApp.config(function($routeProvider) {
  $routeProvider
    .when('/home',
      {
        controller: 'HomeController',
        templateUrl: 'views/home.html'
      })
    .otherwise({ redirectTo: '/home' });
});

var timeUtility = new TimeUtility();

selectorApp.controller('HomeController', function ($scope, $http) {

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
      } else {
        group = groupsForKey[0];
      };

      group.elements.push(element);
    });

    return groups;
  };

  // Properties

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

  $scope.titleFilter = function(show) {
    var re = new RegExp($scope.searchText, 'i');
    return !$scope.searchText || re.test(show.title);
  };

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
      return timeGroup;
    });
  };

  $http.get('data/2013/timeslots.json').success(function(data) {
    $scope.times = data;
    $scope.times.forEach(function(time) {
      time.selected = true;
      time.date = new Date(time.datetime);
      time.dateString = timeUtility.datetimeStringFor(time.date);
      time.timeString = timeUtility.timeStringFor(time.date);
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
          time = $scope.times.filter(function(time) { return time.id === showing_data.timeslot } )[0]
          show = $scope.shows.filter(function(show) { return show.id === showing_data.show_id } )[0]
          return {show: show, time: time, selected: false, selectable: true}
        });
      });
    }
  };

  $scope.relevant_showings = [];

  $scope.selected_showings = [];
  $scope.selectable_showings = [];

  $scope.limit_one_showing_per_show = true;
  $scope.show_unselectable_showings = false;


  // Methods

  $scope.refresh_relevant_showings = function() {
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
      timeGroup.timeString = timeUtility.timeStringFor(timeGroup.time);
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
  };

  // Selection
  assign_selection = function(targetElement, list, value) {
    list.forEach(function(element) {
      if (element == targetElement) {
        element.selected = value;
      };
    });
  };

  toggleSelection = function(targetElement, list) {
    list.forEach(function(element) {
      if (element == targetElement) {
        element.selected = !element.selected;
      };
    });
  };

  // Show selection
  $scope.refresh_show_selections = function() {
    $scope.refresh_relevant_showings();
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

});
