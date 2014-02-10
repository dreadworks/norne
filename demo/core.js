(function ($) {
	'use strict';

	$(function () {
		try {
			var canvas, overlay;

			canvas = $('#norne');
			overlay = $('#overlay');


			// build a norne instance
			norne({ 
				depth: 100,
				fps: 25,
				angle: 0,
				canvas: canvas[0]
			}, function (world) {

				var state = world.import('map.js');

				state.on('fileLoaded', function (evtname) {
					console.log('loaded!');
				});

/*
				addLanes(world);
				addTwists(world);
				addCharacter(world);

				window.run = function (steps) {
					var i, id;

					if (!steps) { return; }
						
					i = 0;
					id = setInterval(function () {
						i += 5;
						world.pos(i);
						if (i > steps) {
							clearInterval(id);
						}
					}, 33);
				};

				window.world = world;
*/
			});


		} catch(exc) {
			console.error(exc.name, exc.message, exc.stack);
			throw exc;
		}
	});

}(jQuery));