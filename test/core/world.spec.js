describe('core.world', function () {

	afterEach(function () {
		norne.world.clear();
	});


	it('is accessible', function () {
		var world = norne.world();
		expect(world).toBeDefined();
	}); 


	it('may be constructed with depth', function () {
		var world, world2;

		world = norne.world();
		expect(world.depth).toBeDefined();
		expect(world.depth()).toEqual(100);

		world = norne.world(50);
		expect(world.depth()).toEqual(50);

		world2 = norne.world();
		expect(world.depth()).toEqual(50);
		expect(world2.depth()).toEqual(100);
	});


	it('can handle depth() as a setter', function () {
		var world, depth;
		depth = 50;

		world = norne.world();
		expect(world.depth()).toEqual(100);

		expect(world.depth(depth)).toEqual(depth);
		expect(world.depth()).toEqual(depth); 
	});


	it('saves the worlds', function () {
		var world, world2;

		world = norne.world();
		world2 = norne.world();

		expect(norne.world.worlds).toBeDefined();
		expect(norne.world.worlds.length).toEqual(2);
	});


	it('can clear the worlds', function () {
		var world = norne.world();

		expect(norne.world.clear).toBeDefined();
		norne.world.clear();
		expect(norne.world.worlds.length).toEqual(0);
	});


	it('lets me add lanes', function () {
		var world, l1;

		world = norne.world();
		expect(world.addLane).toBeDefined();

		l1 = norne.obj.create('data.lane', 0);
		l1.addPoint(0, 0);
		world.addLane(l1);

		norne.world.clear();
	});


	it('prevents me from adding two lanes with the same dist', function () {
		var world;

		world = norne.world();
		function addLane() {
			var lane = norne.obj.create('data.lane', 0);
			world.addLane(lane);
		}

		addLane();
		expect(addLane).toThrow();
	});


});