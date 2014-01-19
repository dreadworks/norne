

	(function () {

		/**
		 *	Instances of core.world represent
		 *	a norne world consisting of lanes,
		 *	a character and decorative elements.
		 */
		var worldfac = norne.obj
			.define('core.world')
			.uses('util.evt')
			.as({


				/**
				 *	This gets or sets the worlds depth.
				 *	It describes how deep or flat the world
				 *	appears. If the depth is 100, the lane
				 *	with dist 100 gets mapped to the viewports
				 *	size and is static.
				 *
				 *	@param depth {optional} Value between 0 and 100
				 *	@type depth Number
				 */
				depth: function (depth) {
					if (depth < 0 || 100 < depth) {
						norne.exc.raise(
							'norne.world',
							'The depth must be a value between 0 and 100'
						);
					}

					if (depth) {
						this._depth = depth;
					}
					return this._depth;
				},


				/**
				 *	The worlds width is the outermost
				 *	right point x of any added lane.
				 */
				width: function () {
					return this._width;
				},


				/**
				 *	Add a lane to the world.
				 *
				 *	@param lane The lane to be added
				 *	@type lane norne.obj.create('core.lane')
				 */
				addLane: function (lane) {
					var that = this;

					lane.on('addPoint', function () {
						if (lane.width() > that._width) {
							that._width = lane.width();
						}
					});

					this.lanes[lane.dist] = lane;
				},


				addCharacter: function (character) {
					// TODO implement when core.character is supplied.
				}

			}, function (depth) {

				// private
				this._width = 0;
				this._depth = depth || 100;

				// public
				this.lanes = {};
			});


		/**
		 *	globally accessible proxy to create worlds
		 *
		 */
		norne.register('world', {

			worlds: [],

			clear: function () {
				this.worlds = [];
			}

		}, function (norne, depth) {
			var world = worldfac.create(depth);
			this.worlds.push(world);
			norne.trigger('addWorld', world, this.worlds.length-1);
			return world;
		});

	}());
