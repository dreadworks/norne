
	(function () {

		var xhrfac,
			slice;

		slice = Array.prototype.slice;

		xhrfac = norne.obj
			.define('util.xhr')
			.uses('util.evt')
			.as({


				_trigger: function (that, type, event) {
					var target = event.target;

					that.trigger.call(that, type, {
						data: target.response,
						status: target.status,
						statusText: target.statusText
					});
				},


				_handle: function (xhr) {
					var	that;
					that = this;

					xhr.addEventListener('load', function (e) {
						if (e.target.status !== 200) {
							that._trigger(that, 'error', e);
							return;
						}
						that._trigger(that, 'success', e);
					});

					xhr.addEventListener('error', function (e) {
						// i hope this is the correct indicator for timeouts
						if (e.target.status === 0) {
							that._trigger(that, 'timeout', e);
						}
						that._trigger(that, 'error', e);
					});
				},


				/**
				 *	Retrieve data via ajax.
				 *
				 *	@param url Resource
				 *	@type url String
				 */
				get: function (url) {
					var xhr;

					xhr = new XMLHttpRequest();

					// create event proxies
					this._handle(xhr);

					// open connection
					xhr.open('GET', url, true);

					// append properties
					if (this.opts.timeout) {
						xhr.timeout = this.opts.timeout;
					}

					// start retrieval
					xhr.send();
				}


			}, function (opts) {
				this.opts = opts || {};
			});


		/**
		 *	A very small and simple ajax interface.
		 */
		norne.register('xhr', function (norne, opts) {
			return xhrfac.create(opts);
		});

	}());
