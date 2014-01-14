

	(function () {

		var worldfac = norne.obj
			.define('core.world')
			.uses('evt')
			.as({

				lanes: {},

				depth: function () {
					return this._depth;
				},

				width: function () {
					return this._width;
				},

				addLane: function (lane) {
					if (lane.width() > this._width) {
						this._width = lane.width();
					}

					this.lanes[lane.dist] = lane;
				},

				addCharacter: function (character) {
					// TODO implement when core.character is supplied.
				}

			}, function (depth) {
				this._width = 0;
				this._depth = depth || 100;

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
			return world;
		});

	}());
