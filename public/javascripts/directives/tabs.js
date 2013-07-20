var tabsDirective = function() {
  return {
    restrict: 'C',
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
    templateUrl: 'directives/tabs.html',
    replace: true
  };
};

var paneDirective = function() {
  return {
    require: '^tabs',
    restrict: 'C',
    transclude: true,
    scope: { title: '@' },
    link: function(scope, element, atrs, tabsController) {
      tabsController.addPane(scope);
    },
    templateUrl: 'directives/pane.html',
    replace: true
  };
};
