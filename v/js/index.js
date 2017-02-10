//var currentSound = new Audio('http://s390567314.onlinehome.fr/music/Aeris_theme_piano.mp3');
//var currentSound = new Audio('https://dl.dropboxusercontent.com/u/87705298/Skull%20Fire.mp3');
//currentSound.play();

/**************************
** FUNCTIONS PRINCIPALES **
**************************/
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame     ||
		window.mozRequestAnimationFrame        ||
		function(callback, element){
			window.setTimeout(callback, 1000 / 60);
		};
})();

var init = function() {
	console.log('Init start !');
	//mise à l'échelle du canvas
	resize();
	gain();
	getData();
}
window.onload = init;

/*********************
** FUNCTIONS AUDIOS **
*********************/

window.AudioContext = (function(){
	return window.AudioContext || window.mozAudioContext;
})();
var audioCtx = new AudioContext(); //Initialisation du contexte audio
var source = audioCtx.createBufferSource();
var buffer = audioCtx.createBuffer(2, 22050, 44100);

var audioPlaying = false;
var sourceSaver;

var gain = function() {
	var gain = audioCtx.createGain();
	source.connect(gain);
	gain.connect(audioCtx.destination);
	gain.gain.value = 0.8;
}

var getData = function() {
	var request = new XMLHttpRequest();
	request.open('GET', '//goo.gl/bMYAO2', true);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		var audioData = request.response;
		audioCtx.decodeAudioData(audioData, function(buffer) {
			source.buffer = buffer;
			source.connect(audioCtx.destination);
			source.loop = true;
		},
		function(e){"Error with decoding audio data" + e.err});
	}
	request.send();
	sourceSaver = source;
};

var play = document.getElementsByClassName('play')[0].addEventListener("click", function() {
	source = sourceSaver;
	source.start(audioCtx.currentTime);
    audioPlaying = true;
});

var stop = document.getElementsByClassName('stop')[0].addEventListener("click", function() {
	source.stop(0);
    audioPlaying = false;
});

/*********************
** FUNCTIONS CANVAS **
*********************/

var canvas = document.getElementById("visualizer");
var canvasCtx = canvas.getContext("2d");

var resize = function() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
};
window.onresize = resize;

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// draw an oscilloscope of the current audio source
var analyser = audioCtx.createAnalyser();
analyser.fftSize = 1024;
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;
source.connect(analyser);
analyser.connect(audioCtx.destination);

var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

var draw = function() {
	canvasCtx.clearRect(0, 0, width, height);
	analyser.getByteFrequencyData(dataArray);

	canvasCtx.lineWidth = 2;
	canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

	canvasCtx.beginPath();
	
	var barWidth = width / bufferLength;
	var barHeight;
	var x = 0;

	for(var i = 0; i < analyser.fftSize; i++) {

		var v = dataArray[i] / 128.0;
		var y = height + v * - height/2;

		if(i === 0) {
			canvasCtx.moveTo(x, y);
		} else {
			canvasCtx.lineTo(x, y);
		}

		x += barWidth + 1;
	}

	canvasCtx.lineTo(width, height/2);
	canvasCtx.stroke();
	
	
	
	requestAnimationFrame(draw);
	
};
draw();
