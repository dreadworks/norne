	
	/**
	 *	Factory for event objects.
	 */
	norne.obj.define('evt').as({

		events: {},

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
			if (!this.events[evtname]) {
				this.events[evtname] = [];
			}

			if (this.events[evtname]) {
				this.events[evtname].push(callback);
			} else {
				this.events[evtname] = [evtname];
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
				delete this.events[evtname];
			} else {
				this.events[evtname] = _(this.events[evtname]).without(callback);
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
		trigger: function (evtname) {
			var args = Array.prototype.slice.call(arguments);
			args.shift();

			_(this.events[evtname]).each(function (handler) {
				handler.apply(this, args);
			});
		}

	});


	/**
	 *	Global norne event system for library wide events.
	 */
	norne.register('evt', norne.obj.create('evt'));
