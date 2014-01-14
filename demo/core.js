(function () {
	'use strict';

	/*
	 *  called by norne
	 */
	function init(world) {

		var lane = norne.lane.create({
			dist: 30
		});

		lane.addPoint({
			x: 300,
			y: 50
		}, {
			x: 100,
			y: 0
		}, {
			x: 800,
			y: 20
		}, {
			x: 4000,
			y: 50
		}, {
			x: 1200,
			y: -20
		});

		world.addLane(lane);
		world.create();
	}


	$(function () {
	/*	norne({
			canvas: $('#norne')[0]
		}, init);
	*/
	});

}());