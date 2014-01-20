describe('data.lane', function () {

	it('should be accessible', function () {
		var lanefac = norne.obj.get('data.lane');
		expect(lanefac).toBeDefined();
	});


	it('checks the constructors parameters', function () {
		function catcher () {
			norne.obj.create('data.lane');
		}

		expect(catcher).toThrow();
	});


	it('should let me add points', function () {
		var lane, point, stub;

		lane = norne.obj.create('data.lane', 0);
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
		var lane = norne.obj.create('data.lane', 0),
			max = 100;

		lane.addPoint(10, 0);
		lane.addPoint(max, 0);
		lane.addPoint(20, 0);

		expect(lane.width()).toEqual(max);
	});


	it('handles sorted insertion', function () {
		var lane, points, range;

		lane = norne.obj.create('data.lane', 0);
		points = [{x: -30, y: 0}, {x: 40, y: 0}, {x: 100, y: 0}];

		_(points).each(function (p) {
			lane.addPoint(p.x, p.y);
		});

		range = lane.getPoints();
		_(points).each(function (p, i) {
			expect(range[i].x).toEqual(p.x);
			expect(range[i].y).toEqual(p.y);
		});
	});


	it('handles unsorted insertion', function () {
		var lane, points, range;

		lane = norne.obj.create('data.lane', 0);
		points = [{x: 30, y: 0}, {x: -50, y: 0}, {x: 100, y: 0}, {x: 60, y: 0}];

		_(points).each(function (p) {
			lane.addPoint(p.x, p.y);
		});

		range = lane.getPoints();
		points = _(points).sortBy(function (p) {
			return p.x;
		});

		_(points).each(function (p, i) {
			expect(range[i].x).toEqual(p.x);
			expect(range[i].y).toEqual(p.y);
		});
	});


	it('lets me retrieve from range', function () {
		var lane, p_true, p_false, p_union, p_diff, points;

		// should be inside the range
		p_true = [
			{x: 30, y: 0}, {x: -50, y: 0}, {x: 100, y: 0}, {x: 60, y: 0}
		];

		// should be outside the range
		p_false = [
			{x: 2000, y: 0}, {x: 101, y: 0}, {x: -80, y: 0}
		];

		// all elements sorted
		p_union = _(_.union(p_true, p_false)).sortBy(function (p) {
			return p.x;
		});

		// just elements in range, sorted
		p_diff = _(p_union).difference(p_false);

		lane = norne.obj.create('data.lane', 0);
		_(_.union(p_false, p_true)).each(function (p) {
			lane.addPoint(p.x, p.y);
		});

		// now with params, p[x-1] until p[y+1] must be returned
		points = lane.getPoints(0, 60);
		_(p_diff).each(function (p, i) {
			expect(points[i].x).toEqual(p.x);
			expect(points[i].y).toEqual(p.y);
		});
	});


	it('should retrieve correct points in extreme cases', function () {
		// TODO test for cases like one point added at 0,0
		// or the range is outside defined points etc.
	});

});
