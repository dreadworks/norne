(function ($) {
	'use strict';

	$(function () {
		//try {


			// build a norne instance
			norne({ 
				depth: 100,
				fps: 25,

			}, function (env) {
				var lane;

				env.setRenderer('render.canvas', $('#norne')[0]);

				lane = env.createLane(50);
				lane.addPoint(-30, 50);
				lane.addPoint(40, 0);
				lane.addPoint(1300, 40);

				console.log('init done', lane, env);

			});


		//} catch(exc) {
		//	console.error(exc.name, exc.message);
		//}
	});

}(jQuery));