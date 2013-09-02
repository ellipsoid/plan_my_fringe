'use strict'

Application.Controllers.controller('ShowSelectionController', function ($scope, $http, $cookies, $dialog, $timeout, SchedulerObjects) {

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
  $scope.venues = [];

  // user options
  $scope.groupByVenue = false;

  // Get objects from data
  SchedulerObjects.then(function(objects) {
    $scope.venues = objects.venues;
    $scope.shows = objects.shows;

    tryLoadingShowSelections();
  });

  // load selections from server or localStorage, if available
  var tryLoadingShowSelections = function() {
    if (Modernizr.localstorage && localStorage["showSelectionData"]) {
      var data = JSON.parse(localStorage["showSelectionData"]);

      assignShowSelectionsFromData(data);
    }
  };

  $scope.saveShowSelectionsToLocalStorage = function() {
    var data = getShowSelectionsAsDataObject();
    localStorage["showSelectionData"] = JSON.stringify(data);
  };

  // Methods

  $scope.toggleSelectShow = function(show) {
    show.invertSelection();
    $scope.saveShowSelectionsToLocalStorage();
  };

  var userId = function() {
    return $cookies.uid;
  };

  var assignShowSelectionsFromData = function(selectedShowIds)
  {
    // clear all current selections
    $scope.shows.forEach(function(show) { show.deselect(); });

    // select shows according to ids
    selectedShowIds.forEach(function(showId) {
      var show = findById($scope.shows, showId);
      show.select();
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

  var getShowSelectionsAsDataObject = function() {
    var data = getSelectedIds($scope.shows);
    return data;
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
