app.directive('song', function() {

  return {
    scope: {item: '&'},
    templateUrl: 'components/song/template.html',
    link: function(scope, elem, attrs) {
      scope.wavesurfer = WaveSurfer.create({
        container: elem[0].getElementsByClassName('soundwave')[0],
        waveColor: 'gray',
        progressColor: 'purple',
        barWidth: 5,
      });
      scope.wavesurfer.load('/static/sounds/imperial_march.wav');
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
