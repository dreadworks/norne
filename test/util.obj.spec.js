describe('norne.obj', function () {

	var o = norne.obj;

	it('is accessible', function () {
		expect(norne.obj).toBeDefined();
	});


	it('lets define and erase', function () {
		var obj;

		expect(norne.obj.define).toBeDefined();
		obj = norne.obj.define('test');
		expect(norne.obj.objs.test).toBeDefined();

		expect(norne.obj.erase).toBeDefined();
		norne.obj.erase('test');
		expect(norne.obj.objs.test).not.toBeDefined();
	});


	it('prevents overwrite attempts', function () {
		norne.obj.define('test');

		function catcher() {
			return norne.obj.define('test');
		}

		expect(catcher).toThrow();
		norne.obj.erase('test');
	});


	it('returns correct values when erasing', function () {
		norne.obj.define('test');

		expect(norne.obj.erase('test')).toBe(true);
		expect(norne.obj.erase('test')).toBe(false);
	});		


	it('can create', function () {
		var obj, base, inst1;
		expect(norne.obj.create).toBeDefined();

		base = { x: 'x' };
		obj = norne.obj.define('test').as(base);

		inst1 = obj.create();

		expect(inst1.x).toEqual(base.x);

		inst1.x = 'something else';
		expect(inst1.x).not.toEqual(base.x);

		norne.obj.erase('test');
	});


	it('lets recieve', function () {
		var obj;

		expect(norne.obj.get).toBeDefined();
		norne.obj.define('test');
		obj = norne.obj.get('test');

		expect(obj).toBeDefined();
		norne.obj.erase('test');
	});


	it('creates independent instances', function () {
		var obj, inst1, inst2;
		obj = norne.obj.define('test').as({
			x: 1
		});

		inst1 = obj.create();
		inst2 = obj.create();

		inst2.x = 2;

		expect(inst1.x).toEqual(1);
		expect(inst2.x).toEqual(2);

		norne.obj.erase('test');
	});


	it('uses the constructor function', function () {
		var obj, inst1, inst2;

		obj = norne.obj.define('test').as({
			x: 0
		}, function (x) {
			this.x = x;
		});

		inst1 = obj.create(1);
		inst2 = obj.create(2);

		expect(inst1.x).toEqual(1);
		expect(inst2.x).toEqual(2);

		norne.obj.erase('test');
	});


	it('can be invoked globally', function () {
		var inst1;

		norne.obj.define('test').as({
			x: 0
		}, function (x) {
			this.x = x;
		});

		inst1 = norne.obj.create('test', 3);

		expect(inst1.x).toEqual(3);
		norne.obj.erase('test');
	});


	it('can be extended', function () {
		var obj, base;
		base = { x: 0 };

		obj = norne.obj.define('test').uses(
			base
		).create();

		expect(obj.x).toEqual(0);
		base.x = 2;
		expect(obj.x).toEqual(0);

		norne.obj.erase('test');
	});


	it('can be extended by other norne.obj definitions', function () {
		var obj, base;

		base = { x: 1 };
		norne.obj.define('base').as(base);
		norne.obj.define('test').uses('base');

		obj = norne.obj.create('test');
		expect(obj.x).toEqual(base.x);

		norne.obj.erase('base');
		norne.obj.erase('test');
	});


	it('may define a prototype', function () {
		var proto1, obj, inst1, inst2;

		proto1 = { proto1: 1 };

		obj = norne.obj.define('test').has(
			proto1
		);

		inst1 = obj.create();
		inst2 = obj.create();

		expect(inst1.proto1).toEqual(proto1.proto1);
		expect(inst2.proto1).toEqual(proto1.proto1);

		proto1.proto1 = 42;
		expect(inst1.proto1).toEqual(proto1.proto1);
		expect(inst2.proto1).toEqual(proto1.proto1);

		norne.obj.erase('test');
	});


});




