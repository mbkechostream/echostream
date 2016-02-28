app.controller('RootTopicsController', ['$scope', '$window', 'API', function($scope, $window, API) {

  $scope.redirectToEchoesPage = function() {
    $window.location.href = '/echoes';
  };

}]);
