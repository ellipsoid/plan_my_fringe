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
      .when('/home',
        {
          controller: 'SchedulerController',
          templateUrl: 'views/home.html'
        })
      .otherwise({ redirectTo: '/home' });
}]);

//Application.Filters.filter('titleFilter', function() {
//  return function(list, title) {
//    if (!title || title == "") { return list; }
//    var resultList = list.filter(function(item) {
//      return item.title.toLowerCase().indexOf(title.toLowerCase()) != -1;
//    });
//    return resultList;
//  };
//});
