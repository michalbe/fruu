var canvas;
var context;
var proton;
var renderer;
var emitter;
var textInit;
var index;
var randomBehaviour;
var gravity;
var outputCanvas;
// var slide = ['grunt', 'jquery'];
var textRate;
var imageRate;
var defaults = {
  fontSize: 300
};

var currentSlide = 0;

if (window.location.hash) {
  currentSlide = parseInt(window.location.hash.replace('#', ''), 10);
}

Main();

function Main() {
  outputCanvas = document.getElementById("fruu");

  canvas = document.getElementById("textCanvas");
  outputCanvas.width = canvas.width = window.innerWidth;
  outputCanvas.height = canvas.height = window.innerHeight;

  context = canvas.getContext('2d');
  proton = new Proton;
  emitter = new Proton.Emitter();
  imageRate = new Proton.Rate(new Proton.Span(50, 10), new Proton.Span(.01));
  textRate = new Proton.Rate(new Proton.Span(50, 15), new Proton.Span(.02));
  createProton();
  loadImage();
  tick();
}

var changeSlide = function(dir) {
  if (currentSlide + dir === -1 || currentSlide + dir === slides.slides.length) {
    return;
  }

  currentSlide += dir;

  window.location.hash = '#' + currentSlide;

  if (Math.random() > 0.3) {
    randomBehaviour.reset(30, 20, .01);
    gravity.reset(0);
  } else {
    randomBehaviour.reset(20, 20, .2);
  	gravity.reset(3.5);
  }

  setTimeout(loadImage, 500);
}

document.addEventListener('keyup', function(e) {
  switch(e.keyCode) {
    case 37:
      changeSlide(-1);
      break;
    case 13:
    case 32:
    case 39:
      changeSlide(1);
      break;
  }
});

function loadImage() {
	// var rect = new Proton.Rectangle((canvas.width - e.target.width) / 2, (canvas.height - e.target.height) / 2, e.target.width, e.target.height);
	// var rect = new Proton.Rectangle(0, 0,  window.innerWidth, window.innerHeight);
	// context.drawImage(e.target, rect.x, rect.y);
  context.clearRect(0, 0,  window.innerWidth, window.innerHeight);

  if (typeof slides.slides[currentSlide] === 'string') {
    emitter.removeInitialize(textInit);
    emitter.rate = textRate;
    context.font = "500px Arial";
    context.textAlign = 'center';
    context.fillText(slides.slides[currentSlide], window.innerWidth/2, window.innerHeight/2, window.innerWidth*0.95);
    var imagedata = context.getImageData(0, 0,  window.innerWidth, window.innerHeight);
  	textInit = emitter.addInitialize(new Proton.P(new Proton.ImageZone(imagedata, 0, 50)));
    randomBehaviour.reset(2, 2, .2);
  	gravity.reset(0);
  } else if (typeof slides.slides[currentSlide] === 'object' && slides.slides[currentSlide].image) {
    emitter.rate = imageRate;
    var image = new Image()
    image.onload = function(e) {
      emitter.removeInitialize(textInit);
      context.drawImage(e.target, window.innerWidth/2 - e.target.width/2, 50);
      var imagedata = context.getImageData(0, 0,  window.innerWidth, window.innerHeight);
    	textInit = emitter.addInitialize(new Proton.P(new Proton.ImageZone(imagedata, 0, 50)));
      randomBehaviour.reset(2, 2, .2);
    	gravity.reset(0);
    }
    image.src = slides.slides[currentSlide].image;
  }
}

function createProton(rect) {
	//setRate
	// emitter.rate = new Proton.Rate(new Proton.Span(50, 15), new Proton.Span(.01));
	// emitter.rate = new Proton.Rate(new Proton.Span(50, 15), new Proton.Span(.02));
	//addInitialize
	emitter.addInitialize(new Proton.Position(new Proton.PointZone(0, 0)));
	emitter.addInitialize(new Proton.Mass(1));
	emitter.addInitialize(new Proton.Radius(4, 7));
	emitter.addInitialize(new Proton.Life(2));
	//addBehaviour

	randomBehaviour = new Proton.RandomDrift(2, 2, .2);
	gravity = new Proton.Gravity(0);
	emitter.addBehaviour(customScaleBehaviour());
	emitter.addBehaviour(gravity);
	emitter.addBehaviour(randomBehaviour);
	// emitter.addBehaviour(new Proton.Color(['#00aeff', '#0fa954', '#54396e', '#e61d5f']));
  emitter.addBehaviour(new Proton.Color(['random']));
  emitter.addBehaviour(new Proton.Alpha(1, 0.5));
	emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'collision'));
	emitter.emit();
	//add emitter
	proton.addEmitter(emitter);

	//canvas renderer
	renderer = new Proton.Renderer('webgl', proton, outputCanvas);
	renderer.start();

	//debug
	// Proton.Debug.drawEmitter(proton, canvas, emitter);

	// index = 0;
	// window.addEventListener('mousedown', function(e) {
	// 	index++;
	// 	if (index % 3 == 1) {
	// 		randomBehaviour.reset(2, 0, .2);
	// 		gravity.reset(1.5);
	// 	} else if (index % 3 == 2) {
	// 		randomBehaviour.reset(50, 50, .1);
	// 		gravity.reset(0);
	// 	} else {
	// 		randomBehaviour.reset(2, 2, .2);
	// 		gravity.reset(0);
	// 	}
	// });
}

function customScaleBehaviour() {
	return {
		initialize : function(particle) {
			particle.oldRadius = particle.radius;
			particle.scale = 0;
		},
		applyBehaviour : function(particle) {
			if (particle.energy >= 2 / 3) {
				particle.scale = (1 - particle.energy) * 3;
			} else if (particle.energy <= 1 / 3) {
				particle.scale = particle.energy * 3;
			}
			particle.radius = particle.oldRadius * particle.scale;
		}
	}
}

function tick() {
	requestAnimationFrame(tick);
	proton.update();
}
