

	(function () {

		var brokerfac;

		/**
		 *
		 *
		 *
		 */
		brokerfac = norne.obj
			.define('render.canvas.broker')
			.uses('util.evt')
			.as({

				somethingHappened: function () {
					this.trigger('update', {});
				}

			}, function (world) {

				this.world = world;
				this.world.on('update', this.somethingHappened);

			});


		/**
		 *
		 *
		 *
		 */
		norne.obj
			.define('render.canvas')
			.uses('util.evt')
			.as({


				repaint: function () {

				}


			}, function (world) {

				this.broker = brokerfac.create(world);

			});

	}());
