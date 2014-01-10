(function (norne) {

	var worldWidth = 0;

	norne.register('world', {

		canvas: undefined,
		lanes: {},

		exc: _({}).extend(norne.exception, {
			name: 'norne.world'
		}),


		/**
		 *	Adds a lane to the world.
		 *
		 *	@param lane The lane to be added
		 *	@type lane norne.lane.create()
		 */
		addLane: function (lane) {
			var	width;

			if (this.lanes[lane.dist]) {
				throw _(this.exc).extend({
					message: 'A lane with that distance already exists'
				});
			}

			width = lane.

/*
			width = 100 * lane.dist + this.viewportWidth();
			if (width > worldWidth) {
				worldWidth = width;
			}
*/
			this.lanes[lane.dist] = lane;
		},


		/**
		 *	Returns the worlds canvas width.
		 */
		viewportWidth: function () {
			return this.canvas.clientWidth;
		},


		/**
		 *	Returns the calculated world width
		 *	based on the rightmost ground point of
		 *	all lanes.
		 */
		worldWidth: function () {
			return worldWidth;
		},


		/**
		 *	Create the world, this starts the renderer.
		 *
		 */
		create: function () {
			// TODO
		}

	}, function (norne, opts) {
		
		this.canvas = opts.canvas || document.body;
		return this;

	});

}(norne));