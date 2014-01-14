describe('core.lane', function () {

	it('should be accessible', function () {
		var lanefac = norne.obj.get('core.lane');
		expect(lanefac).toBeDefined();
	});


	it('should let me add points', function () {
		var lane, point, stub;

		lane = norne.obj.create('core.lane', 0);
		point = { x: 50, y: 100};
		stub = {
			evt: function (p) {
				expect(p.x).toEqual(point.x);
				expect(p.y).toEqual(point.y);
			}
		};

		spyOn(stub, 'evt');
		expect(lane.addPoint).toBeDefined();
		lane.on('addPoint', stub.evt);

		lane.addPoint(50, 100);
		expect(stub.evt).toHaveBeenCalled();
	});


	it('returns the correct width', function () {
		var lane = norne.obj.create('core.lane', 0),
			max = 100;

		lane.addPoint(10, 0);
		lane.addPoint(max, 0);
		lane.addPoint(20, 0);

		expect(lane.width()).toEqual(max);
	});

});