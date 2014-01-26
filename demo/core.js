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

				var lane;
				lane = world.createLane(50);
				lane.color('efefef');
				_(20).times(function (i) {
					var y = (i%2 === 0) ? 200 : 400;
					var x = i * 1000 - 1000;
					lane.addPoint(x,y);
				});

				console.log('init done', world);
				window.world = world;


			});


		//} catch(exc) {
		//	console.error(exc.name, exc.message);
		//}
	});

}(jQuery));