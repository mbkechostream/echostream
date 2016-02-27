app.directive('soundbite', function() {

  return {
    scope: {item: '&'},
    templateUrl: 'components/soundbite/template.html',
    controller: ['$scope', function($scope) {
      $scope.item = $scope.item();
    }]
  };

});
