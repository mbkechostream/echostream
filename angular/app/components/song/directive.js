app.directive('song', function() {

  return {
    scope: {item: '&'},
    templateUrl: 'components/song/template.html',
    controller: ['$scope', function($scope) {
      $scope.item = $scope.item();
      $scope.hideTracklist = 'isHidden';
      $scope.toggleTracklist = function() {
      	$scope.showTracks = !$scope.showTracks;
      }
    }]
  };

});
