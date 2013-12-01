/**
 *
 *  trying to build a tree here
 *  the norne way
 *
 */
jQuery(function () {
	'use strict';

	var $canvas, canvas, ctx, bounds,
		world, renderer, behaviours,
		particles, forcefields;


	// init physics
	world = new Physics();
	Physics.util.ticker.start();

	// init canvas
	$canvas = jQuery('#viewport');
	canvas = {
		width: $canvas.width(),
		height: $canvas.height()
	};

	// init renderer
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
	ctx = renderer.ctx;

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
			restitution: 1,
			cof: 1
		}),
		Physics.behavior('body-impulse-response'),
        Physics.behavior('newtonian', { strength: 0.001 }),
        Physics.behavior('sweep-prune'),
        Physics.behavior('body-collision-detection', { checkAll: false })
	);


	// init bodies
	forcefields = [Physics.body('circle', {
		radius: 0,
		x: canvas.width/2,
		y: canvas.height/5,
		mass: 10,
		fixed: true
	}), Physics.body('circle', {
		radius: 0,
		x: canvas.width/2-50,
		y: canvas.height/2,
		mass: 30,
		fixed: true
	})];

	particles = [];
	_.times(200, function () {
		particles.push(Physics.body('circle', {
			x: _.random(canvas.width),
			y: _.random(canvas.height),
			mass: _.random(2, 5),
			radius: _.random(4, 10),
			restitution: 1
		}));
	});


	// init world
	world.add(forcefields);
	world.add(particles);
	world.add(renderer);

	_.each(behaviours, function(behaviour) {
		world.add(behaviour);
	});

	Physics.util.ticker.subscribe(function (time) {
		world.step(time);
		world.render();

		// draw other, static stuff
		_.each(forcefields, function(f) {
			ctx.beginPath();
			ctx.arc(f.options.x, f.options.y, f.mass, 0, 3.14*2);
			ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
			ctx.fill();
		});
	});

});
