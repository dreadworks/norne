(function ($) {
	'use strict';

	$(function () {
		//try {


			// build a norne instance
			norne({ 
				depth: 100,
				fps: 25,

			}, function (env) {
				var lane, character;

				env.setRenderer('render.canvas', $('#norne')[0]);

				lane = env.createLane(50);


				lane.color('0099ff');

				lane.addPoint(-30, 50);
				lane.addPoint(40, 0);
				lane.addPoint(1300, 40);

				character = env.setCharacter({
                        sprite: 'sprite_sheet.png',
                        width: '130',
                        height: '150'
                });
 
	            character.addAnimation('walking.right', {
	                    frame: { width: 130, height: 150 },
	                    start: { x: 0, y: 0 },
	                    columns: 7,
	                    framecount: 27
                });

				console.log('init done', lane, env);

			});


		//} catch(exc) {
		//	console.error(exc.name, exc.message);
		//}
	});

}(jQuery));