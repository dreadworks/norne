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

				lanes = [{
					dist: 50,
					color: '0099ff',
					points: [
						{ x: -30, y: 50 }, { x: 40, y: 0 }, { x: 1300, y: 40 }
					]
				}];

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

				
				_(lanes).each(function (lane) {
					var l = world.createLane(lane.dist);
					l.color(lane.color);
					_(lane.points).each(function (p) {
						l.addPoint(p.x, p.y);
					});
				});

				console.log('init done', world);

			});


		} catch(exc) {
			console.error(exc.name, exc.message);
			throw exc;
		}
	});

}(jQuery));