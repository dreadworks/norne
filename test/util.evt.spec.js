describe('norne.evt', function () {

	it('should be accessible', function () {
		expect(norne.evt).toBeDefined();
	});


	it('should let me register callbacks', function () {
		expect(norne.evt.on).toBeDefined();

		var stub = {
			callback: function () {}
		};

		spyOn(stub, 'callback');

		norne.evt.on('test', stub.callback);
		expect(stub.callback).toHaveBeenCalled();
	});

});