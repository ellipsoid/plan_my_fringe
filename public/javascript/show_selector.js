var selectorApp = angular.module('selectorApp', []);

selectorApp.config(function($routeProvider) {
  $routeProvider
    .when('/home',
      {
        controller: 'HomeController',
        templateUrl: 'views/home.html'
      })
    .when('/assignment',
      {
        controller: 'AssignmentController',
        templateUrl: 'views/assignment.html'
      })
    .otherwise({ redirectTo: '/home' });
});


selectorApp.controller('HomeController', function ($scope) {

  // Properties

  // Show selection
  $scope.shows = [
    {id: 1, title:'Test Show 1', venue: 'Rarig Thrust', selected: false},
    {id: 2, title:'Test Show 2', venue: 'Rarig Thrust', selected: false},
    {id: 3, title:'Test Show 3', venue: 'Rarig Proscenium', selected: false},
    {id: 4, title:'Test Show 4', venue: 'Rarig Proscenium', selected: false},
  ];

  $scope.selected_shows = [];

  // Time selection
  $scope.times = [
    {id: 101, time: "08/01/2013, 5:30PM", selected: true },
    {id: 102, time: "08/01/2013, 7:00PM", selected: true },
    {id: 103, time: "08/01/2013, 8:30PM", selected: true },
    {id: 104, time: "08/01/2013, 10:00PM", selected: true },
  ];

  // use a copy of times array
  $scope.selected_times = $scope.times.slice(0);

  // Showing selection
  $scope.showings_data = [
    {id: 1001, show_id: 1, time_id: 101 },
    {id: 1002, show_id: 1, time_id: 102 },
    {id: 1003, show_id: 2, time_id: 103 },
    {id: 1004, show_id: 2, time_id: 104 },
    {id: 1005, show_id: 3, time_id: 101 },
    {id: 1006, show_id: 4, time_id: 102 },
    {id: 1007, show_id: 3, time_id: 103 },
    {id: 1008, show_id: 4, time_id: 104 },
  ];

  $scope.showings = $scope.showings_data.map(function(data) {
    time = $scope.times.filter(function(time) { return time.id === data.time_id } )[0]
    show = $scope.shows.filter(function(show) { return show.id === data.show_id } )[0]
    return {id: data.id, show: show, time: time, selected: false, selectable: true}
  });

  $scope.relevant_showings = [];

  $scope.selected_showings = [];

  $scope.limit_one_showing_per_show = true;


  // Methods

  $scope.refresh_relevant_showings = function() {
    $scope.relevant_showings = $scope.showings.filter(function(showing) {
      return showing.show.selected && showing.time.selected
    });
  };

  $scope.refresh_relevant_showings_selectable = function() {
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
      };
    });
  };

  // Show selection
  $scope.selectShow = function(show) {
    var selectedIndex = $scope.selected_shows.indexOf(show);
    // only add to selected list if not already included
    if (selectedIndex === -1) {
      show.selected = true;
      $scope.selected_shows.push(show)

      // refresh relevant showings
      $scope.refresh_relevant_showings()
    };
  };

  $scope.deselectShow = function(show) {
    var selectedIndex = $scope.selected_shows.indexOf(show);
    $scope.selected_shows.splice(selectedIndex,1);

    // find show in original list and mark as unselected
    var showsIndex = $scope.shows.indexOf(show);
    $scope.shows[showsIndex].selected = false;

    // refresh relevant showings
    $scope.refresh_relevant_showings()
  };


  // Time selection
  $scope.selectTime = function(time) {
    var selectedIndex = $scope.selected_times.indexOf(time);
    // only add to selected list if not already included
    if (selectedIndex === -1) {
      time.selected = true;
      $scope.selected_times.push(time)

      // refresh relevant showings
      $scope.refresh_relevant_showings()
    };
  };

  $scope.deselectTime = function(time) {
    var selectedIndex = $scope.selected_times.indexOf(time);
    $scope.selected_times.splice(selectedIndex,1);

    // find time in original list and mark as unselected
    var timesIndex = $scope.times.indexOf(time);
    $scope.times[timesIndex].selected = false;

    // refresh relevant showings
    $scope.refresh_relevant_showings()
  };


  // Showng selection
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
