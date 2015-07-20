'use strict'

Application.Controllers.controller('FestivalController', function ($scope) {
  $scope.years = [
		{string: "2012", url: "#/mnfringe/2012"},
    {string: "2013", url: "#/mnfringe/2013"},
    {string: "2014", url: "#/mnfringe/2014"},
    {string: "2015", url: "#/mnfringe/2015"},
  ];
});
