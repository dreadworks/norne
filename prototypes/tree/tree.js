/**
 *
 *  trying to build a tree here
 *  the norne way
 *
 */

(function ($) {
	'use strict';

	/**
	 *	this is essentially a copy of the 'circle' body
	 */
	Physics.body('forcefield', function (parent) {

		var defaults = {
			radius: 0,
			fixed: true
		};

		return {

			/**
			 * Initialization
			 * @param {Object} options Configuration options
			 * @return {void}
			 */
			 init: function (options) {
				parent.init.call(this, options);
				options = _.extend({}, defaults, options);

				this.geometry = Physics.geometry('circle', {
					radius: options.radius
				});

				this.recalc();
			 },

			 recalc: function () {
				parent.recalc.call(this);
				this.moi = this.mass * this.geometry * this.geometry / 2;
			 }

		};

	});


	var world, forcefields;
	world = new Physics();


	/*
	 *	adds bodies and behaviours
	 *	to the current world
	 */
	function init_bodies(canvas) {
		var bounds, behaviours, particles;

		// init behaviours
		bounds = Physics.aabb(
			0, 0,
			canvas.width,
			canvas.height
		);

		behaviours = [];
		behaviours.push(
			Physics.behaviour('edge-collision-detection', {
				aabb: bounds,
				restitution: 0.5,
				cof: 1
			}),
			Physics.behavior('body-impulse-response'),
			Physics.behavior('newtonian', { strength: 0.001 }),
			Physics.behavior('sweep-prune'),
			Physics.behavior('body-collision-detection', { checkAll: false })
		);

		world.add(behaviours);

		
		// init bodies
		forcefields = [
			{ x: canvas.width/2, y: canvas.height/4 },
			{ x: canvas.width/2-50, y: canvas.height/2 },
			{ x: canvas.width/2, y: canvas.height/1.5 }
		];

		forcefields = _.map(forcefields, function (pos) {
			var opts = _.extend({ mass: 40 }, pos);
			return Physics.body('forcefield', opts);
		});

		world.add(forcefields);


		particles = [];
		_.times(200, function () {
			particles.push(Physics.body('circle', {
				x: _.random(
					canvas.width/4,
					canvas.width/1.2
				),
				y: _.random(
					canvas.height/5,
					canvas.height/1.5
				),
				mass: 1,
				radius: _.random(8,10),
				restitution: 0.5
			}));
		});

		world.add(particles);
		console.log('added', particles.length, 'particles');
	}


	/*
	 *	renders bodies and additional
	 *	elements to the canvas
	 */
	function render(time, ctx) {

		world.step(time);
		world.render();

		// draw other, static stuff
		_.each(forcefields, function(f) {
			ctx.beginPath();
			ctx.arc(f.options.x, f.options.y, Math.log(f.mass), 0, Math.PI*2);
			ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
			ctx.fill();
		});
	}

	
	/*
	 *	wrap the render() calls to gather
	 *	statistical informations
	 */
	function init_rendering(canvas) {
		var renderer, paused, $cntrl, steps, $steps;

		renderer = Physics.renderer('canvas', {
			el: 'viewport',
			width: canvas.width,
			height: canvas.height,
			meta: true,
			styles: {
				'circle': {
					lineWidth: 0,
					strokeStyle: 'rgba(0, 0, 0, 0)',
					angleIndicator: 'rgba(0, 0, 0, 0)',
					fillStyle: 'hsl(35, 60%, 70%)'
				}
			}
		});
		world.add(renderer);

		paused = false;
		$cntrl = $('#cntrl');

		steps = 0;
		$steps = $('#stats_steps');

		Physics.util.ticker.subscribe(function (time) {
			steps += 1;
			render(time, renderer.ctx);
			$steps.text(steps);
		});

		$cntrl.on('click', 'button.pause', function () {
			if (paused) {
				Physics.util.ticker.start();
			} else {
				Physics.util.ticker.stop();
			}

			paused = !paused;
		});
	}


	$(function () {
		var $canvas, canvas;

		$canvas = $('#viewport');
		canvas = {
			width: $canvas.width(),
			height: $canvas.height()
		};

		init_bodies(canvas);
		init_rendering(canvas);
		Physics.util.ticker.start();
	});

}(jQuery));
