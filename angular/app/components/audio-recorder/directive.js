app.directive('audioRecorder', function() {

  var pack = function (c, arg) {
    return [
      new Uint8Array([arg, arg >> 8]),
      new Uint8Array([arg, arg >> 8, arg >> 16, arg >> 24])
    ][c];
  };

  var interleave = function (cData) {
    var len = cData[0].length;
    var count = cData.length;
    var combined = new Int16Array(len * count);
    var n = 0;
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < count; j++) {
        combined[n++] = cData[j][i];
      }
    }
    return combined;
  };

  var createBeat = function (sampleRate, length, bpm) {

    var frequency = 261.63;
    var channelData = Array(2);

    for (var c = 0; c < channelData.length; c++) {

      var output = new Int16Array(length);

      for (var i = 0; i < output.length; i++) {
        var val = Math.sin(2 * Math.PI * (i / sampleRate) * frequency);
        var dampen = (1 + Math.sin(2 * Math.PI * (i / sampleRate) * (bpm / 60))) / 2;
        output[i] = Math.round(val * 0x7FFF * dampen);
      }

      channelData[c] = output;

    }

    return channelData;

  };

  var combineChannels = function (channelsArray) {

    var max = 0;
    var index = 0;
    for (var i = 0; i < channelsArray.length; i++) {
      if (channelsArray[i][0].length > max) {
        max = channelsArray[i][0].length;
        index = i;
      }
    }

    var fromArray = channelsArray.splice(index, 1)[0];

    return fromArray.map(function(fromChannel, n) {
      var channel = new Int16Array(fromChannel.length);
      for (var i = 0; i < channel.length; i++) {
        var sum = fromChannel[i];
        for (var j = 0; j < channelsArray.length; j++) {
          var curChan = channelsArray[j];
          if (curChan.loop) {
            sum += parseInt(curChan[n][i % curChan[n].length]) || 0;
          } else {
            sum += parseInt(curChan[n][i]) || 0;
          }
        }
        channel[i] = Math.round(sum / (channelsArray.length + 1));
      }
      return channel;
    });

  };

  return {
    templateUrl: 'components/audio-recorder/template.html',
    controller: ['$scope', '$sce', function($scope, $sce) {

      var createAudio = function (sampleRate, channelData) {

        var bitsPerSample = 16;
        var channels = channelData.length;
        var data = interleave(channelData);

        var out = [
          'RIFF',
          pack(1, 4 + (8 + 24/* chunk 1 length */) + (8 + data.length)), // Length
          'WAVE',
          // chunk 1
          'fmt ', // Sub-chunk identifier
          pack(1, 16), // Chunk length
          pack(0, 1), // Audio format (1 is linear quantization)
          pack(0, channels),
          pack(1, sampleRate),
          pack(1, sampleRate * channels * bitsPerSample / 8), // Byte rate
          pack(0, channels * bitsPerSample / 8),
          pack(0, bitsPerSample),
          // chunk 2
          'data', // Sub-chunk identifier
          pack(1, data.length * bitsPerSample / 8), // Chunk length
          data
        ];

        var blob = new Blob(out, {type: 'audio/wav'});

        return {
          sampleRate: sampleRate,
          channels: channelData,
          blob: blob,
          uri: $sce.trustAsResourceUrl(URL.createObjectURL(blob))
        };

      }

      $scope.openStream = null;
      $scope.samples = [];

      $scope.startRecording = function() {

        if ($scope.openStream) {
          return;
        }

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia || navigator.msGetUserMedia;

        navigator.getUserMedia(
          {audio: true},
          function success(stream) {

            var leftChannel = [];
            var rightChannel = [];


            // creates the audio context
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            var context = new AudioContext();

            // retrieve the current sample rate to be used for WAV packaging
            var sampleRate = context.sampleRate;

            // Set stream
            $scope.openStream = {
              stream: stream,
              context: context,
              channels: [
                leftChannel,
                rightChannel
              ],
              sampleRate: sampleRate,
              length: 0
            };

            // creates a gain node
            var volume = context.createGain();

            // creates an audio node from the microphone incoming stream
            var audioInput = context.createMediaStreamSource(stream);

            // connect the stream to the gain node
            audioInput.connect(volume);

            /* From the spec: This value controls how frequently the audioprocess event is
            dispatched and how many sample-frames need to be processed each call.
            Lower values for buffer size will stream in a lower (better) latency.
            Higher values will be necessary to avoid audio breakup and glitches */
            var bufferSize = 2048;
            console.log('context', context);
            recorder = context.createScriptProcessor(bufferSize, 2, 2);

            recorder.onaudioprocess = function(e) {
              console.log ('recording');
              var left = e.inputBuffer.getChannelData(0);
              var right = e.inputBuffer.getChannelData(1);
              // we clone the samples
              leftChannel.push(new Float32Array(left));
              rightChannel.push(new Float32Array(right));
              $scope.openStream.length += bufferSize;
            }

            // we connect the recorder
            volume.connect(recorder);
            recorder.connect(context.destination);

            $scope.$apply();

          },
          function error(e) {
            alert('Error capturing audio.');
          }
        );

      };

      $scope.stopRecording = function() {

        if ($scope.openStream) {
          $scope.openStream.stream.getTracks().forEach(function(track) { track.stop(); });
          $scope.openStream.context.close();
          processStream($scope.openStream);
        }
        $scope.openStream = null;

      };

      function processStream(openStream) {

        var channels = openStream.channels.map(function(channel) {

          var data = new Int16Array(openStream.length);
          var n = 0;
          channel.forEach(function(cData) {
            for (var i = 0; i < cData.length; i++) {
              data[n++] = Math.round(cData[i] * 0x7FFF);
            }
          });

          return data;

        });

        // channels = combineChannels(
        //   channels,
        //   createBeat(openStream.sampleRate, openStream.length, 98)
        // );

        $scope.samples.push(createAudio(openStream.sampleRate, channels));
      }

      $scope.combine = function() {

        var samples = $scope.samples.filter(function(s) { return s.selected; });
        if (samples.length < 1) {
          return;
        }

        var sampleRate = samples[0].sampleRate;
        var channels = samples.map(function(s) {
          var channels = s.channels;
          channels.loop = s.loop;
          return channels;
        });
        $scope.samples.push(createAudio(sampleRate, combineChannels(channels)));

      };

      $scope.upload = function($file) {

        console.log($file);
        var reader = new FileReader();
        reader.onload = function() {

          var buffer = reader.result;
          var newBuffer;
          var arr = new Uint8Array(buffer);
          for (var i = 0; i < arr.length; i++) {
            if (
              arr[i] === 'd'.charCodeAt(0) &&
              arr[i + 1] === 'a'.charCodeAt(0) &&
              arr[i + 2] === 't'.charCodeAt(0) &&
              arr[i + 3] === 'a'.charCodeAt(0)
            ) {
              newBuffer = buffer.slice(i + 4);
              break;
            }
          }

          if (!newBuffer) {
            alert('Could not load file');
          }

          var data = new Int16Array(newBuffer);
          var channels = [
            new Int16Array(data.length >>> 1),
            new Int16Array(data.length >>> 1)
          ];

          for (var i = 0; i < data.length; i += 2) {
            channels[0][i >>> 1] = data[i];
            channels[1][(i >>> 1) + 1] = data[i + 1];
          }

          $scope.samples.push(createAudio(44100, channels));
          $scope.$apply();

        };
        reader.readAsArrayBuffer($file);

      };

    }]
  };

});
