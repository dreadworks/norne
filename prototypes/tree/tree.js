/**
 *
 *  trying to build a tree here
 *  the norne way
 *
 */
 var world;
jQuery(function () {
	'use strict';
	
	var $canvas, canvas, ctx, bounds,
		renderer, behaviours,
		particles, forcefields;


	// init physics
	world = new Physics();
	world.options({timestep: 1000/50});
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
	forcefields = [
	Physics.body('circle', {
		radius: 0,
		x: 500,
		y: 500,
		mass: 40,
		fixed: true
	}),
	Physics.body('circle', {
		radius: 0,
		x: 540,
		y: 280,
		mass: 20,
		fixed: true
	})];

	particles = [];
	_.times(180, function () {
		particles.push(Physics.body('circle', {
			x: _.random(350, 650),
			y: _.random(250, 600),
			mass: _.random(0.1,1),
			radius: _.random(8, 10),
			restitution: 0.1
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
