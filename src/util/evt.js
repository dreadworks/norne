	norne.obj.define('evt').as({

		events: {},

		on: function (evtname, callback) {
			if (!this.events[evtname]) {
				this.events[evtname] = [];
			}


		},

		off: function (evtname) {

		},

		trigger: function (evtname, evt) {

		}

	});

	norne.register('evt', norne.obj.create('evt'));
