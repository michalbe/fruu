var canvas;
var context;
var proton;
var renderer;
var emitter;
var index;
var randomBehaviour;
var gravity;
var slide = ['grunt', 'jquery'];
var i = 0;
Main();

function Main() {
	canvas = document.getElementById("testCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context = canvas.getContext('2d');
	context.globalCompositeOperation = "lighter";
  proton = new Proton;
  emitter = new Proton.Emitter();

  loadImage();
  setTimeout(function() {
    i++;
    loadImage();
  }, 3000);
}

function loadImage() {
	// var rect = new Proton.Rectangle((canvas.width - e.target.width) / 2, (canvas.height - e.target.height) / 2, e.target.width, e.target.height);
	var rect = new Proton.Rectangle(0, 0,  window.innerWidth, window.innerHeight);
	// context.drawImage(e.target, rect.x, rect.y);
  context.font = "300px Arial";
  context.clearRect(0, 0,  window.innerWidth, window.innerHeight);
  context.fillText(slide[i], 100, 200);
	createProton(rect);
	tick();
}

function createProton(rect) {
  emitter.removeInitializers();
  emitter.removeAllBehaviours();
  emitter.removeAllParticles();
  emitter.stopEmit();
  proton.removeEmitter(emitter);

	//setRate
	emitter.rate = new Proton.Rate(new Proton.Span(50, 15), new Proton.Span(.02));
	//addInitialize
	emitter.addInitialize(new Proton.Position(new Proton.PointZone(0, 0)));
	emitter.addInitialize(new Proton.Mass(1));
	emitter.addInitialize(new Proton.Radius(1, 10));
	emitter.addInitialize(new Proton.Life(2));
	var imagedata = context.getImageData(rect.x, rect.y, rect.width, rect.height);
	emitter.addInitialize(new Proton.P(new Proton.ImageZone(imagedata, rect.x, rect.y + 50)));
	//addBehaviour

	randomBehaviour = new Proton.RandomDrift(2, 2, .2);
	gravity = new Proton.Gravity(0);
	emitter.addBehaviour(customScaleBehaviour());
	emitter.addBehaviour(gravity);
	emitter.addBehaviour(randomBehaviour);
	emitter.addBehaviour(new Proton.Color(['#00aeff', '#0fa954', '#54396e', '#e61d5f']));
	emitter.addBehaviour(new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'collision'));
	emitter.emit();
	//add emitter
	proton.addEmitter(emitter);

	//canvas renderer
	renderer = new Proton.Renderer('canvas', proton, canvas);
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
