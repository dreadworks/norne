

	(function () {

		var brokerfac;

		/**
		 *
		 *
		 *
		 */
		brokerfac = norne.obj
			.define('render.canvas.broker')
			.uses('evt')
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
			.uses('evt')
			.as({


				repaint: function () {

				}


			}, function (world) {

				this.broker = brokerfac.create(world);

			});

	}());
