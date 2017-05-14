import { Proton } from '../libs/proton.js';

const defaults = {
  font_size: 300,
  color: ['random']
};

export class Fruu {
  constructor(selector = '#fruu') {

    this.selector = selector;
    this.canvas = document.createElement('canvas');
    this.output_canvas = document.querySelector(this.selector);
    this.context = canvas.getContext('2d');
    this.proton = new Proton;
    this.text_rate = new Proton.Rate(new Proton.Span(50, 15), new Proton.Span(.02));
    this.image_rate = new Proton.Rate(new Proton.Span(50, 10), new Proton.Span(.01));
    this.emitter = new Proton.Emitter();

    this.renderer = null;

    this.text_init = null;
    this.index = null;
    this.random_behaviour = null;
    this.gravity = null;
    this.color_behaviour = null;
    this.current_slide = 0;

    // If we're not starting from the first slide, handle this here
    if (window.location.hash) {
      this.current_slide = parseInt(window.location.hash.replace('#', ''), 10);
    }

    document.addEventListener('keyup', this.handle_keys.bind(this));

    this.output_canvas.width = this.canvas.width = window.innerWidth;
    this.output_canvas.height = this.canvas.height = window.innerHeight;

    this.init_proton();
    this.load_image();
    this.tick();
  }

  init_proton() {
  	this.emitter.addInitialize(new Proton.Position(new Proton.PointZone(0, 0)));
  	this.emitter.addInitialize(new Proton.Mass(1));
  	this.emitter.addInitialize(new Proton.Radius(4, 7));
  	this.emitter.addInitialize(new Proton.Life(2));

    this.randomBehaviour = new Proton.RandomDrift(2, 2, .2);
  	this.gravity = new Proton.Gravity(0);
  	this.emitter.addBehaviour(this.custom_scale_behaviour());
  	this.emitter.addBehaviour(this.gravity);
  	this.emitter.addBehaviour(this.random_behaviour);

    this.color_behaviour = emitter.addBehaviour(new Proton.Color(defaults.color));
    this.emitter.addBehaviour(new Proton.Alpha(1, 0.5));
  	this.emitter.addBehaviour(new Proton.CrossZone(
      new Proton.RectZone(0, 0, this.canvas.width, this.canvas.height), 'collision')
    );

  	this.emitter.emit();

  	this.proton.addEmitter(emitter);

  	this.renderer = new Proton.Renderer('webgl', this.proton, this.output_canvas);
  	this.renderer.start();
  }

  change_slide(dir) {
    if (this.current_slide + dir === -1 || this.current_slide + dir === slides.data.length) {
      return;
    }

    this.current_slide += dir;

    window.location.hash = '#' + this.current_slide;

    if (Math.random() > 0.3) {
      this.random_behaviour.reset(30, 20, .01);
      gravity.reset(0);
    } else {
      this.random_behaviour.reset(20, 20, .2);
    	this.gravity.reset(3.5);
    }

    setTimeout(this.load_image, 500);
  }

  handle_keys(e) {
    switch(e.keyCode) {
      case 37:
        this.change_slide(-1);
        break;
      case 13:
      case 32:
      case 39:
        this.change_slide(1);
        break;
    }
  }
}

function loadImage() {
	// var rect = new Proton.Rectangle((canvas.width - e.target.width) / 2, (canvas.height - e.target.height) / 2, e.target.width, e.target.height);
	// var rect = new Proton.Rectangle(0, 0,  window.innerWidth, window.innerHeight);
	// context.drawImage(e.target, rect.x, rect.y);
  context.clearRect(0, 0,  window.innerWidth, window.innerHeight);
  emitter.removeBehaviour(colorBehaviour);
  if (typeof slides.slides[currentSlide] === 'string') {
    colorBehaviour = emitter.addBehaviour(new Proton.Color(defaults.color));
    emitter.removeInitialize(textInit);
    emitter.rate = textRate;
    context.font = "500px Arial";
    context.textAlign = 'center';
    context.fillText(slides.slides[currentSlide], window.innerWidth/2, window.innerHeight/2 + 50, window.innerWidth*0.95);
    var imagedata = context.getImageData(0, 0,  window.innerWidth, window.innerHeight);
  	textInit = emitter.addInitialize(new Proton.P(new Proton.ImageZone(imagedata, 0, 50)));
    randomBehaviour.reset(2, 2, .2);
  	gravity.reset(0);
  } else if (typeof slides.slides[currentSlide] === 'object' && slides.slides[currentSlide].image) {
    if (slides.slides[currentSlide].color) {
      colorBehaviour = emitter.addBehaviour(new Proton.Color(slides.slides[currentSlide].color));
    } else {
      colorBehaviour = emitter.addBehaviour(new Proton.Color(defaults.color));
    }
    emitter.rate = imageRate;
    var image = new Image();
    image.crossOrigin = '';
    image.onload = function(e) {
      emitter.removeInitialize(textInit);
      context.textAlign = 'left';
      fitImageOn(e.target);
      var imagedata = context.getImageData(0, 0, window.innerWidth, window.innerHeight);
    	textInit = emitter.addInitialize(new Proton.P(new Proton.ImageZone(imagedata, 0, 50)));
      randomBehaviour.reset(2, 2, .2);
    	gravity.reset(0);
    }
    image.src = slides.slides[currentSlide].image;
  }
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

var fitImageOn = function(imageObj) {
	var imageAspectRatio = imageObj.width / imageObj.height;
	var canvasAspectRatio = canvas.width / canvas.height;
	var renderableHeight, renderableWidth, xStart, yStart;

	// If image's aspect ratio is less than canvas's we fit on height
	// and place the image centrally along width
	if(imageAspectRatio < canvasAspectRatio) {
		renderableHeight = canvas.height;
		renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
		xStart = (canvas.width - renderableWidth) / 2;
		yStart = 0;
	}

	// If image's aspect ratio is greater than canvas's we fit on width
	// and place the image centrally along height
	else if(imageAspectRatio > canvasAspectRatio) {
		renderableWidth = canvas.width
		renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
		xStart = 0;
		yStart = (canvas.height - renderableHeight) / 2;
	}

	// Happy path - keep aspect ratio
	else {
		renderableHeight = canvas.height;
		renderableWidth = canvas.width;
		xStart = 0;
		yStart = 0;
	}
	context.drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);
};
