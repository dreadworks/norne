
	(function () {

		var exc;
		exc = norne.obj.define('exc').as({

			toString: function () {
				return this.name;
			}

		}, function (name, message) {
			this.name = name;
			this.message = message;
		});

		/**
		 *	Lets raise some exceptions...
		 */
		norne.register('exc', {
			raise: function (name, message) {
				throw exc.create(name, message);
			}
		});
	}());

