	
	/**
	 *	Factory for event objects.
	 */
	norne.obj.define('util.evt').as({

		/**
		 *	Register a callback to <evtname>. May be called
		 *	by invoking .trigger(<evtname>).
		 *
		 *	@param evtname The name of the event
		 *	@type evtname String
		 *	@param callback Gets called upon .trigger(<evtname>)	
		 *	@type callback Function
		 */
		on: function (evtname, callback) {
			if (!this._events[evtname]) {
				this._events[evtname] = [];
			}

			if (this._events[evtname]) {
				this._events[evtname].push(callback);
			}
		},
		
		
		/**
		 *	Unregister a callback from <evtname>. If no
		 *	<callback> gets provided, the event will be
		 *	removed completely.
		 *
		 *	@param evtname The name of the event
		 *	@type evtname String
		 *	@param callback {optional} Callback to be removed
		 *	@type callback Function
		 */
		off: function (evtname, callback) {
			if (!callback) {
				delete this._events[evtname];
			} else {
				this._events[evtname] = _(this._events[evtname]).without(callback);
			}
		},


		/**
		 *	Trigger all callbacks registered under <evtname>.
		 *	All arguments after evtname will get passed through
		 *	to every callback.
		 *
		 *	@param evtname The name of the event
		 *	@type evtname String
		 */
		trigger: function (evtname, context) {
			var args, that;

			that = this;
			args = _(arguments).toArray();

			args.shift();

			_(this._events[evtname]).each(function (handler) {
				handler.apply(that, args);
			});
		}

	}, function () {
		this._events = {};
	});


	/**
	 *	Global norne event system for library wide events.
	 */
	_(norne).extend(norne.obj.create('util.evt'));
