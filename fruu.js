var canvas;
var context;
var proton;
var renderer;
var emitter;
var index;
var randomBehaviour;
var gravity;

Main();
function Main() {
	canvas = document.getElementById("testCanvas");
	canvas.width = 1003;
	canvas.height = 610;
	context = canvas.getContext('2d');
	context.globalCompositeOperation = "lighter";

	loadImage();
}

function loadImage() {
	var image = new Image()
	image.onload = function(e) {
		var rect = new Proton.Rectangle((canvas.width - e.target.width) / 2, (canvas.height - e.target.height) / 2, e.target.width, e.target.height);
		context.drawImage(e.target, rect.x, rect.y);
		createProton(rect);
		tick();
	}
	image.src = 'image/logo.png';
}

function createProton(rect) {
	proton = new Proton;
	emitter = new Proton.Emitter();
	//setRate
	emitter.rate = new Proton.Rate(new Proton.Span(11, 15), new Proton.Span(.02));
	//addInitialize
	emitter.addInitialize(new Proton.Position(new Proton.PointZone(0, 0)));
	emitter.addInitialize(new Proton.Mass(1));
	emitter.addInitialize(new Proton.Radius(6, 10));
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
	//Proton.Debug.drawEmitter(proton, canvas, emitter);

	index = 0;
	window.addEventListener('mousedown', function(e) {
		index++;
		if (index % 3 == 1) {
			randomBehaviour.reset(2, 0, .2);
			gravity.reset(1.5);
		} else if (index % 3 == 2) {
			randomBehaviour.reset(50, 50, .1);
			gravity.reset(0);
		} else {
			randomBehaviour.reset(2, 2, .2);
			gravity.reset(0);
		}
	});
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
