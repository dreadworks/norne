describe('norne.core.js', function () {

	it('is accessible', function () {
		expect(window.norne).toBeDefined();
	});

});


describe('norne.register', function () {

	it('offers registration', function () {
		expect(window.norne.register).toBeDefined();
	});


	it('handles registration', function () {
		norne.register('test', {});
		expect(norne.test).toBeDefined();

		norne.unregister('test');
		expect(norne.test).not.toBeDefined();
	});


	it('returns correct values for deletion', function () {
		norne.register('test');

		expect(norne.unregister('test')).toBe(true);
		expect(norne.unregister('test')).toBe(false);
	});


	it('considers the opts parameter', function () {
		var x = { foo: 'bar' };
		norne.register('test', x);
		expect(norne.test.foo).toEqual(x.foo);

		x.bar = 'foo';
		expect(norne.test.bar).toEqual(x.bar);

		norne.unregister('test');
	});


	it('considers the fn parameter', function () {
		function f() {
			return 1;
		}

		norne.register('test', {}, f);
		expect(norne.test()).toEqual(f());
		norne.unregister('test');

		norne.register('test', f);
		expect(norne.test()).toEqual(f());
		norne.unregister('test');
	});


	it('handles the scope correctly', function () {
		function f() {
			this.x = 3;
		}

		norne.register('test', f);
		norne.test();
		expect(norne.test.x).toEqual(3);
		norne.unregister('test');
	});


	it('supplies norne as argument', function () {
		norne.register('test', function (n) {
			expect(n).toEqual(window.norne);
		});
		norne.test();
		norne.unregister('test');
	});


	it('supplies arguments correctly', function () {
		function f(norne, x) {
			this.x = x;
		}

		norne.register('test', f);
		norne.test(3);
		expect(norne.test.x).toEqual(3);
		norne.unregister('test');
	});


	it('prevents me from overwriting an existing module', function () {
		norne.register('test');

		function catcher() {
			return norne.register('test');
		}

		expect(catcher).toThrow();
		norne.unregister('test');
	});
});
