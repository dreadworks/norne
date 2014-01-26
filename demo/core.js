(function ($) {
	'use strict';

	$(function () {
		//try {


			// build a norne instance
			norne({ 
				depth: 100,
				fps: 25,
				canvas: $('#norne')[0]

			}, function (world) {

				var lanes, character;

				character = world.character({
					sprite: 'sprites.png',
					width: 1,
					height: 1
				});

				character.addAnimation('walking.right', {
					frame: { width: 130, height: 150 },
					start: { x: 15, y: 20 },
					columns: 7,
					framecount: 27,
					tick: 35
				});

				
				character.addAnimation('standing.right', {
					frame: { width: 83, height: 143.5 },
					start: { x: 10, y: 628 },
					columns: 12,
					framecount: 22,
					tick: 75
				});
				
				/*
				_(5).times(function (dist) {
					var lane;

					dist *= 20;
					lane = world.createLane(dist);
					lane.color('BFA57A');

					_(10).times(function (i) {
						lane.addPoint(i*1000, Math.floor(Math.random() * 500));
					});
				});
				*/
				_(1).times(function (dist) {
					var lane;

					var d = 0
					lane = world.createLane(d);
					lane.color('BFA57A');

					lane.addPoint(-10, 50);
					lane.addPoint(200, 50)
					lane.addPoint(400, 150);
					lane.addPoint(1400, 150);
				});
				


				// put character on dist 0
				world.put(0);
				world.pos(100);


				console.log('init done', world);
				window.world = world;


			});


		//} catch(exc) {
		//	console.error(exc.name, exc.message);
		//}
	});

}(jQuery));