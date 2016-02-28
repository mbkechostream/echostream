app.directive('song', function() {

  return {
    scope: {item: '&'},
    templateUrl: 'components/song/template.html',
    link: function(scope, elem, attrs) {

      scope.wavesurfer = WaveSurfer.create({
        container: elem[0].getElementsByClassName('soundwave')[0],
        waveColor: 'gray',
        progressColor: '#a66dc3',
        barWidth: 2,
      });

      scope.wavesurfer.load(scope.item.raw_data);

    },
    controller: ['$scope', '$window', function($scope, $window) {
      $scope.item = $scope.item();

      $scope.hideTracklist = 'isHidden';
      $scope.toggleTracklist = function() {
      	$scope.showTracks = !$scope.showTracks;
      };
      $scope.redirectToCreatePage = function() {
        $window.location.href = '/create';
      };
      $scope.playSong = function() {
      	$scope.wavesurfer.play();
      	$scope.songPlaying = true;
      };
      $scope.pauseSong = function() {
      	$scope.wavesurfer.pause();
      	$scope.songPlaying = false;
      };
    }]
  };

});
