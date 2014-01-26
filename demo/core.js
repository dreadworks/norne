(function ($) {
	'use strict';

	$(function () {
		try {


			// build a norne instance
			norne({ 
				depth: 100,
				fps: 25,
				canvas: $('#norne')[0]

			}, function (world) {


				var character;

				character = world.character({
					sprite: 'sprites.png',
					width: 1,
					height: 1
				});
				
				character.addAnimation('standing.right', {
					frame: { width: 83, height: 143.5 },
					start: { x: 10, y: 628 },
					columns: 12,
					framecount: 22,
					tick: 75
				});
				

				var colors = ['409EF1', '2F79BA', '245D8F', '1A456B', '0B2A45'];
				_(5).times(function (j) {
					var lane;

					lane = world.createLane(j*20);
					lane.color(colors[j]);

					_(10).times(function (i) {
						lane.addPoint(i*1000, Math.floor(Math.random() * 200) * (j+1));
					});
				});
		

				// put character on dist 0
				world.put(0);
				//world.pos(100);


				/*
				world.addTwist('depth', {
					from: 30,
					to: 100,
					sub: 50
				});
				*/


				// helper shortcuts for debugging
				console.log('init done', world);

				window.world = world;
				
				window.proxycontent = function () {
					_(world.broker.broker.lanes.proxy[0].points).each(function (p) {
						console.log(p.x,p.y);
					});
				};

				window.cachecontent = function () {
					_(world.broker.broker.lanes.cache[50]).each(function (p) {
						console.log(p.x,p.y);
					});
				};

			});


		} catch(exc) {
			console.error(exc.name, exc.message, exc.stack);
			throw exc;
		}
	});

}(jQuery));