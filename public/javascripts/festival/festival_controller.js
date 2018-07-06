'use strict'

Application.Controllers.controller('FestivalController', function ($scope) {
  $scope.years = [
		{string: "2012", url: "#/mnfringe/2012"},
    {string: "2013", url: "#/mnfringe/2013"},
    {string: "2014", url: "#/mnfringe/2014"},
    {string: "2015", url: "#/mnfringe/2015"},
    {string: "2017", url: "#/mnfringe/2017"},
    {string: "2018", url: "#/mnfringe/2018"},
  ];
});
