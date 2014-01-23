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
					dist: 0,
					color: '0099ff',
					points: [
						{ x: 0, y: 150 }, { x: 500, y: 200 }, { x: 1000, y: 150 }, { x: 1400, y: 0 }
					]
				},{
					dist: 20,
					color: '1881C7',
					points: [
						{ x: 0, y: 500 }, { x: 40, y: 0 }, { x: 1500, y: 500 }
					]
				},{
					dist: 50,
					color: '27658F',
					points: [
						{ x: 0, y: 50 }, { x: 40, y: 0 }, { x: 1300, y: 40 }
					]
				},{
					dist: 100,
					color: '254A63',
					points: [
						{ x: 0, y: 500 }, { x: 40, y: 700 }, { x: 1000, y: 900 }
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