app.directive('navigationBar', function() {

  return {
    templateUrl: 'components/navigation-bar/template.html',
    controller: ['$scope', '$location', function($scope, $location) {
      $scope.hideOn = function(viewLocation) {
        return viewLocation === $location.path();
      };
    }]
  };

});
