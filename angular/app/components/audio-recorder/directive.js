app.directive('audioRecorder', function() {

  return {
    templateUrl: 'components/audio-recorder/template.html',
    link: function(scope, elem, attrs) {

      var pack = function(c,arg){ return [new Uint8Array([arg, arg >> 8]), new Uint8Array([arg, arg >> 8, arg >> 16, arg >> 24])][c]; };

      var interleave = function(cData) {
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

      elem.find('button').on('click', function() {

        var time = 30;
        var bitsPerSample = 16;
  	    var channels = 2;
  	    var sampleRate = 44100;
        var frequency = 261.63;
        var channelData = Array(channels);
        var bpm = parseInt(elem.find('#bpm').val());

        for (var c = 0; c < channelData.length; c++) {

          var output = new Int16Array(new ArrayBuffer(Math.ceil(sampleRate * time * 2)));

          for (var i = 0; i < output.length; i++) {
            var val = Math.sin(2 * Math.PI * (i / sampleRate) * frequency);
            var dampen = (1 + Math.sin(2 * Math.PI * (i / sampleRate) * (bpm / 60))) / 2;
            output[i] = Math.round(val * 0x7FFF * dampen);
          }

          channelData[c] = output;

        }

        var data = interleave(channelData);

        var out = [
  				'RIFF',
  				pack(1, 4 + (8 + 24/* chunk 1 length */) + (8 + 8/* chunk 2 length */)), // Length
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
  			var dataURI = URL.createObjectURL(blob);

        var audio = new Audio(dataURI);
        audio.setAttribute('controls', 'true');
        document.body.appendChild(audio);
        console.log(audio);
		    audio.play();

      });

    }
  };

});
