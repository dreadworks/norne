/**
 *
 *  trying to build a tree here
 *  the norne way
 *
 */
jQuery(function () {
	"use strict";
	
	var phys = new Physics(),
	    attrc = new Attraction(),
		canv = new Sketch(document.body);

	// physics
	phys.integrator = new Verlet();

	// attractions
	attrc.target.x = this.width/2;
	attrc.target.y = this.height/2;
	attrc.strength = 100;

	// canvas
	canv.fillStyle = '#ff00ff';

	// init canvas
	canv.setup = function () {
		
		_.each(_.range(100), function (i) {
			
			var particle = new Particle(_.random(100)),
				position = new Vector(
					_.random(this.width), 
					_.random(this.height));

			particle.setRadius(particle.mass * 10);
			particle.moveTo(position);

			particle.behaviours.push(attrc);
			phys.particles.push(particle);

		});

	};

	canv.draw = function () {
		phys.step();

		_.each(phys.particles, function (p) {
			canv.beginPath();
			canv.arc(p.pos.x, p.pos.y, p.radius, 0, 3.14*2);
			canv.fill();
		});
	};
	console.log('done');
	
});

/*
(function () {

	// Create a physics instance which uses the Verlet integration method
	var physics = new Physics();
	physics.integrator = new Verlet();

	// Design some behaviours for particles
	var avoidMouse = new Attraction();
	var pullToCenter = new Attraction();

	// Allow particle collisions to make things interesting
	var collision = new Collision();

	// Use Sketch.js to make life much easier
	var example = Sketch.create({ container: document.body });

	example.setup = function() {

		for ( var i = 0; i < 200; i++ ) {

			// Create a particle
			var particle = new Particle( Math.random() );
			var position = new Vector( random( this.width ), random( this.height ) );
			particle.setRadius( particle.mass * 10 );
			particle.moveTo( position );

			// Make it collidable
			collision.pool.push( particle );

			// Apply behaviours
			particle.behaviours.push( avoidMouse, pullToCenter, collision );

			// Add to the simulation
			physics.particles.push( particle );
		}

		pullToCenter.target.x = this.width / 2;
		pullToCenter.target.y = this.height / 2;
		pullToCenter.strength = 120;

		avoidMouse.setRadius( 60 );
		avoidMouse.strength = -1000;

		example.fillStyle = '#ff00ff';
	}

	example.draw = function() {

		// Step the simulation
		physics.step();

		// Render particles
		for ( var i = 0, n = physics.particles.length; i < n; i++ ) {

			var particle = physics.particles[i];
			example.beginPath();
			example.arc( particle.pos.x, particle.pos.y, particle.radius, 0, Math.PI * 2 );
			example.fill();
		}
	}

	example.mousemove = function() {
		avoidMouse.target.x = example.mouse.x;
		avoidMouse.target.y = example.mouse.y;
	}

}());
*/

