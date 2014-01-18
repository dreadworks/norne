describe('norne.xhr', function () {

	var url = 'http://localhost:8080/';

	it('should be accessible', function () {
		expect(norne.xhr).toBeDefined();
	});


	it('should let me make requests', function () {
		var xhr;
		xhr = norne.xhr();
		expect(xhr.get).toBeDefined();
	});


	it('should trigger "success" with correct arguments', function () {
		var xhr, done;

		xhr = norne.xhr();
		done = false;

		xhr.on('success', function (res) {
			expect(res.status).toEqual(200);
			expect(res.statusText).toEqual('OK');
			expect(JSON.parse(res.data).test).toEqual('norne');
			done = true;
		});

		runs(function () {
			xhr = xhr.get(url + 'test.json');
		});

		waitsFor(function() { 
			return done;
		}, 1000);

	});


	it('should pass error codes etc.', function () {
		var xhr, done;
		xhr = norne.xhr();

		xhr.on('error', function (res) {
			expect(res.status).toEqual(404);
			expect(res.statusText).toEqual('Not Found');
			done = true;
		});

		runs(function () {
			xhr.get(url + 'not/on/my/machine');
		});

		waitsFor(function () {
			return done;
		});
	});


	it('should trigger "error" and "timeout" on specified timeout', function () {
		var xhr, timeoutdone, errordone;

		timeoutdone = false;
		errordone = false;

		xhr = norne.xhr({
			timeout: 1
		});

		xhr.on('timeout', function (res) {
			expect(res.status).toEqual(0);
			expect(res.statusText).toEqual('');
			expect(res.data).toEqual('');
			timeoutdone = true;
		});

		xhr.on('error', function (res) {
			expect(res.status).toEqual(0);
			expect(res.statusText).toEqual('');
			expect(res.data).toEqual('');
			errordone = true;
		});

		runs(function () {
			xhr.get('not/on/my/machine');
		});

		waitsFor(function () {
			return timeoutdone && errordone;
		}, 50);
	});

});