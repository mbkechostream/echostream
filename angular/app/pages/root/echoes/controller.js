app.controller('RootEchoesController', ['$scope', 'API', function($scope, API) {
  
  API.request('soundbites').index({}, function(error, response) {
  	console.log(response.data);
    $scope.songs = response.data;
  });

}]);
