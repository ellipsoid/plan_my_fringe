var selectorApp = angular.module('selectorApp', []).
  directive('tabs', function() {
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
  }).
  directive('pane', function() {
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

  // Properties

  // Show selection
  $scope.shows = [];

  $http.get('data/2013/shows.json').success(function(data) {
    $scope.shows = data;
    $scope.unselected_shows = $scope.shows.slice(0);
  });

  $scope.selected_shows = [];
  $scope.unselected_shows = [];

  var getTimeGroups = function(time_objects) {
    var datetimes = time_objects.map(function(time_object) {
      return new Date(time_object.datetime);
    });

    var dateFilterFunction = function(datetime) {
      return function(group) {
        return group.dateString === datetime.toDateString()
      }
    };

    var groups = [];
    datetimes.forEach(function(datetime) {
      var test = datetime.toDateString();

      // check if there is already a group with this date
      var existing_groups_with_date = groups.filter(dateFilterFunction(datetime));

      // if a group doesn't already exist for this date, add it
      if (existing_groups_with_date.length == 0) {
        var group = new Object();
        group.dateString = datetime.toDateString();
        group.timeStrings = [];

        groups.push(group);
      }
      else {
        group = groups.filter(dateFilterFunction(datetime));
      }

      // add time to list for date
      var timeString = timeUtility.timeStringFor(datetime);
      group.timeStrings.push(timeString);

      // add group to list of groups
      groups.push(group);
    });

    return groups;
  };

  // Time selection
  $scope.times = [];

  $http.get('data/2013/timeslots.json').success(function(data) {
    $scope.times = data;
    $scope.times.forEach(function(time) {
      time.selected = true;
      time.date = new Date(time.datetime);
      time.timeString = timeUtility.datetimeStringFor(time.date);
    });
    $scope.selected_times = $scope.times.slice(0);

    $scope.time_groups = getTimeGroups($scope.times)
  });

  $scope.time_groups = [];

  // use a copy of times array
  $scope.selected_times = [];
  $scope.unselected_times = [];

  // Showing selection

  $scope.showings = [];

  $http.get('data/2013/showings.json').success(function(data) {
    $scope.showings = data.map(function(showing_data) {
      time = $scope.times.filter(function(time) { return time.id === showing_data.timeslot } )[0]
      show = $scope.shows.filter(function(show) { return show.id === showing_data.show_id } )[0]
      return {show: show, time: time, selected: false, selectable: true}
    });
  });

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
    $scope.selected_shows = $scope.shows.filter(function(show) { return show.selected } );
    $scope.unselected_shows = $scope.shows.filter(function(show) { return !show.selected } );
    $scope.refresh_relevant_showings()
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

});
