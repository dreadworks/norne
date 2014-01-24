(function ($) {
	'use strict';

	$(function () {
		try {


			// build a norne instance
			norne({ 
				depth: 100,
				fps: 25,

			}, function (world) {
				var lanes, character;

				// renderer must be set first!
				world.renderer('render.canvas', $('#norne')[0]);

				character = world.character({
					sprite: 'url://*.png',
					width: 'xpx',
					height: 'ypx'
				});

				character.addAnimation('walking.right', {
					frame: { width: 1, height: 1 },
					start: { x: 1, y: 1 },
					columns: 4,
					framecount: 4
				});

				_(5).times(function (dist) {
					var lane;

					dist *= 20;
					lane = world.createLane(dist);
					lane.color('BFA57A');

					_(10).times(function (i) {
						lane.addPoint(i*1000, Math.floor(Math.random() * 500));
					});
				});




				_(lanes).each(function (lane) {
					var l = world.createLane(lane.dist);
					l.color(lane.color);
					_(lane.points).each(function (p) {
						l.addPoint(p.x, p.y);
					});
				});

				console.log('init done', world);
				window.world = world;

			});


		} catch(exc) {
			console.error(exc.name, exc.message);
			throw exc;
		}
	});

}(jQuery));