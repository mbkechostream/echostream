app.controller('RootEchoesController', ['$scope', 'API', function($scope, API) {
  
  API.request('soundbites').index({}, function(error, response) {
    $scope.songs = response.data;
  });

}]);
