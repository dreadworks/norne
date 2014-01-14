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

});
