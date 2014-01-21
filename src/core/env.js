
	(function () {

		var exc;
		exc = _(norne.exc.raise).partial('norne');

		norne.obj
			.define('core.env')
			.as({

				setRenderer: function (name, canvas) {
					var that;

					if (!_(canvas).isElement()) {
						exc('setRenderer: no canvas provided');
					}

					that = this;
					this.renderer = norne.obj.create(name, {
						world: this.world, 
						canvas: canvas,
						delay: 1000/that.opts.fps
					});

					return this.renderer;
				},


				createLane: function (dist) {
					var lane;

					lane = norne.obj.create('data.lane', dist);
					this.world.addLane(lane);

					return lane;
				},

				setCharacter: function (params) {
					var character;

					character = norne.obj.create(
							'data.character',
							params
						);

					return character;
				}


			}, function (opts) {

				var defaults = {
					depth: 100,
					fps: 30
				};

				this.opts = _(defaults).extend(opts);
				this.world = norne.world(this.opts.depth);

			});

	}());
