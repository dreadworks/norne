describe('norne.evt', function () {

	var stub;

	beforeEach(function () {
		stub = {
			callback: function () {},
			anotherCallback: function () {}
		};

		spyOn(stub, 'callback');
		spyOn(stub, 'anotherCallback');
	});

	it('should be accessible', function () {
		expect(norne.evt).toBeDefined();
	});


	it('lets me register callbacks', function () {
		expect(norne.evt.on).toBeDefined();
		expect(norne.evt.trigger).toBeDefined();

		norne.evt.on('test', stub.callback);
		norne.evt.trigger('test');
		expect(stub.callback).toHaveBeenCalled();
	});


	it('lets me deactivate the event', function () {
		expect(norne.evt.off).toBeDefined();

		norne.evt.on('test', stub.callback);
		norne.evt.off('test');

		norne.evt.trigger('test');
		expect(stub.callback).not.toHaveBeenCalled();
	});


	it('handles multiple callbacks', function () {
		norne.evt.on('test', stub.callback);
		norne.evt.on('test', stub.anotherCallback);

		norne.evt.trigger('test');
		expect(stub.callback).toHaveBeenCalled();
		expect(stub.anotherCallback).toHaveBeenCalled();

		norne.evt.off('test');
	});


	it('lets me remove particular callbacks', function () {
		norne.evt.on('test', stub.callback);
		norne.evt.on('test', stub.anotherCallback);

		norne.evt.off('test', stub.anotherCallback);
		norne.evt.trigger('test');

		expect(stub.callback).toHaveBeenCalled();
		expect(stub.anotherCallback).not.toHaveBeenCalled();

		norne.evt.off('test');
	});


	it('should pass arguments over to the callback', function () {
		var a, b;

		a = 0;
		b = 1;

		norne.evt.on('test', stub.callback);
		norne.evt.trigger('test', a, b);
		expect(stub.callback).toHaveBeenCalledWith(a, b);
	});


	it('passes the correct context to the callbacks', function () {
		var context, stub;

		stub = {
			callback: function () {
				expect(this).toEqual(norne);
			}
		};

		spyOn(stub, 'callback');
		norne.evt.on('test', stub.callback);

		norne.evt.trigger('test');
		norne.evt.off('test');

		expect(stub.callback).toHaveBeenCalled();
	});


	it('handles callbacks autonomous', function () {
		var evt1, evt2;

		evt1 = norne.obj.create('evt');
		evt2 = norne.obj.create('evt');

		evt1.on('test', stub.callback);
		evt2.on('test', stub.anotherCallback);

		evt1.trigger('test');
		expect(stub.callback).toHaveBeenCalled();
		expect(stub.anotherCallback).not.toHaveBeenCalled();
	});


	it('works with norne.obj.define', function () {
		var fac1, fac2, evt1, evt2, evt3;

		fac1 = norne.obj.define('evt1').uses('evt');
		fac2 = norne.obj.define('evt2').uses('evt');

		evt1 = fac1.create();
		evt2 = fac1.create();
		evt3 = fac2.create();

		evt1.on('test', stub.callback);
		evt2.on('test', stub.anotherCallback);
		evt3.on('test', stub.anotherCallback);

		evt1.trigger('test');
		expect(stub.callback).toHaveBeenCalled();
		expect(stub.anotherCallback).not.toHaveBeenCalled();
	});

});
