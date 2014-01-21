(function ($) {
	'use strict';

	$(function () {
		//try {


			// build a norne instance
			norne({ 
				depth: 100,
				fps: 25,

			}, function (env) {

				var lanes, character;

				env.setRenderer('render.canvas', $('#norne')[0]);

				lanes = [{
					dist: 50,
					color: '0099ff',
					points: [
						{ x: -30, y: 50 }, { x: 40, y: 0 }, { x: 1300, y: 40 }
					]
				}];

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

				
				_(lanes).each(function (lane) {
					var l = env.createLane(lane.dist);
					l.color(lane.color);
					_(lane.points).each(function (p) {
						l.addPoint(p.x, p.y);
					});
				});

				console.log('init done', env);


			});


		//} catch(exc) {
		//	console.error(exc.name, exc.message);
		//}
	});

}(jQuery));