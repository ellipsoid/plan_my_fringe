function ShowsCtrl($scope) {
  $scope.show_options = [
    {text:'First show', selected: false},
    {text:'Second show', selected: false}];

  $scope.selected_shows = [];
 
  $scope.selectShow = function(show_text) {
    $scope.selected_shows.push({text:show_text, selected:true});
    $scope.showText = 'monkeys';
  };
 
  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.show_options, function(show) {
      count += show.done ? 0 : 1;
    });
    return count;
  };
 
  $scope.archive = function() {
    var oldShows = $scope.show_options;
    $scope.show_options = [];
    angular.forEach(oldShows, function(show) {
      if (!show.done) $scope.todos.push(show);
    });
  };
}
