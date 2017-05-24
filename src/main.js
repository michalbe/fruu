import { Proton } from '../libs/proton.js';
import { fit_image_on_canvas } from './utils.js';

const defaults = {
  font_size: 300,
  color: ['random']
};

class Fruu {
  constructor(selector = '#fruu') {

    this.selector = selector;
    this.canvas = document.createElement('canvas');
    this.output_canvas = document.querySelector(this.selector);
    this.context = this.canvas.getContext('2d');
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
    this.render_slide();
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

    if (this.random_behaviour) {
      this.emitter.addBehaviour(this.random_behaviour);
    }

    this.color_behaviour = this.emitter.addBehaviour(new Proton.Color(defaults.color));
    this.emitter.addBehaviour(new Proton.Alpha(1, 0.5));
  	this.emitter.addBehaviour(new Proton.CrossZone(
      new Proton.RectZone(0, 0, this.canvas.width, this.canvas.height), 'collision')
    );

  	this.emitter.emit();

  	this.proton.addEmitter(this.emitter);

  	this.renderer = new Proton.Renderer(
      'webgl',
      this.proton,
      this.output_canvas
    );
  	this.renderer.start();
  }

  change_slide(dir) {
    if (
      this.current_slide + dir === -1 ||
      this.current_slide + dir === slides.data.length
    ) {
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

    setTimeout(this.render_slide, 500);
  }

  render_slide() {
    this.context.clearRect(0, 0,  window.innerWidth, window.innerHeight);
    this.emitter.removeBehaviour(this.color_behaviour);

    if (typeof slides.data[this.current_slide] === 'string') {
      this.color_behaviour = this.emitter.addBehaviour(
        new Proton.Color(defaults.color)
      );
      this.emitter.removeInitialize(this.text_init);
      this.emitter.rate = this.text_rate;
      this.context.font = "500px Arial";
      this.context.textAlign = 'center';
      this.context.fillText(
        slides.data[this.current_slide],
        window.innerWidth / 2,
        window.innerHeight / 2 + 50,
        window.innerWidth * 0.95
      );

      const image_data = this.context.getImageData(
        0, 0,
        window.innerWidth, window.innerHeight
      );

    	this.text_init = this.emitter.addInitialize(
        new Proton.P(new Proton.ImageZone(image_data, 0, 50))
      );
      this.random_behaviour.reset(2, 2, .2);
    	this.gravity.reset(0);

    } else if (
      typeof slides.data[this.current_slide] === 'object' &&
      slides.data[this.current_slide].image
    ) {

      this.color_behaviour = this.emitter.addBehaviour(new Proton.Color(
        slides.data[this.current_slide].color || defaults.color
      ));

      this.emitter.rate = this.image_rate;
      const image = new Image();
      image.crossOrigin = '';
      image.onload = (e) => {
        this.emitter.removeInitialize(this.text_init);
        this.context.textAlign = 'left';
        fit_image_on_canvas(e.target, this.canvas, this.context);

        const image_data = this.context.getImageData(
          0, 0,
          window.innerWidth, window.innerHeight
        );

      	this.text_init = this.emitter.addInitialize(
          new Proton.P(new Proton.ImageZone(image_data, 0, 50))
        );

        this.random_behaviour.reset(2, 2, .2);
      	this.gravity.reset(0);
      }
      image.src = slides.data[this.current_slide].image;
    }
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

  custom_scale_behaviour() {
  	return {
  		initialize : (particle) => {
  			particle.oldRadius = particle.radius;
  			particle.scale = 0;
  		},
  		applyBehaviour : (particle) => {

  			if (particle.energy >= 2 / 3) {
  				particle.scale = (1 - particle.energy) * 3;
  			} else if (particle.energy <= 1 / 3) {
  				particle.scale = particle.energy * 3;
  			}

  			particle.radius = particle.oldRadius * particle.scale;
  		}
  	}
  }

  tick() {
  	requestAnimationFrame(this.tick.bind(this));
  	this.proton.update();
  }
}

export default { Fruu };
