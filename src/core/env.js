
	(function () {

		var exc;
		exc = _(norne.exc.raise).partial('norne');

		norne.obj
			.define('core.env')
			.as({

				setRenderer: function (name, canvas) {
					if (!_(canvas).isElement()) {
						exc('setRenderer: no canvas provided');
					}

					this.renderer = norne.obj.create(
						name, this.world, canvas
					);
					
					return this.renderer;
				},


				createLane: function (dist) {
					var lane;

					lane = norne.obj.create('core.lane', dist);
					this.world.addLane(lane);

					return lane;
				},


			}, function (opts) {

				var defaults = {
					depth: 100
				};

				opts = _(defaults).extend(opts);
				this.world = norne.world(opts.depth);

			});

	}());
