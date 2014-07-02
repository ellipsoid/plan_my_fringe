'use strict'

/**
* Taken from github.com/thedigitalself/angular-sprout/
* The application file bootstraps the angular app by  initializing the main module and 
* creating namespaces and moduled for controllers, filters, services, and directives. 
*/

var Application = Application || {};

Application.Constants = angular.module('application.constants', []);
Application.Services = angular.module('application.services', []);
Application.Controllers = angular.module('application.controllers', []);
Application.Filters = angular.module('application.filters', []);
Application.Directives = angular.module('application.directives', []);

angular.module('application', ['application.filters', 'application.services', 'application.directives', 'application.constants', 'application.controllers', 'ngCookies', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/',
	{
		redirectTo: '/mnfringe/2014'
	  //controller: 'RootController',
	  //templateUrl: 'views/root.html'
	})
      .when('/:festivalGroupId',
	{
	  controller: 'FestivalController',
          templateUrl: 'views/festival.html'
        })
      .when('/:festivalGroupId/:festivalId',
        {
          controller: 'SchedulerController',
          templateUrl: 'views/home.html'
        })
      .when('/:festivalGroupId/:festivalId/show-selection',
        {
          controller: 'ShowSelectionController',
          templateUrl: 'views/home.html'
        })
      .otherwise({ redirectTo: '/mnfringe/2014' });
}]);
