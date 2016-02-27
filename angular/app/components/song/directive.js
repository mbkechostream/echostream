app.directive('song', function() {

  return {
    scope: {item: '&'},
    templateUrl: 'components/song/template.html',
    controller: ['$scope', function($scope) {
      $scope.item = $scope.item();
    }]
  };

});
