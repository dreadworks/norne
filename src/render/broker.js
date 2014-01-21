	/**
	 *	Instances of this object sit between /core and /render.
	 *	They handle calculations to transform pixel values handed
	 *	from core.world to viewport pixel values. They also serve
	 *	as a cache for retrieved values.
	 */
	norne.obj
		.define('render.broker')
		.uses('util.evt')
		.as({

			/**
			 *	This method translates the absolute pixel
			 *	values delivered by the world to relative pixel
			 *	values as seen by the canvas.
			 *	This means that the users virtual position in the
			 *	world must be factored in for x-values. Also, the
			 *	y-values must be inverted to show lanes bottom up.
			 *
			 *	@param points Objects with x and y properties.
			 *	@type points Array
			 */
			mapPoints: function (points) {
				var that, pos;

				that = this;
				pos = -this.world.pos();

				return _(points).map(function (p) {
					return {
						x: pos + p.x,
						y: that.canvas.height - p.y
					};
				});
			},


			/**
			 *	This method gets called when the world
			 *	fires events that indicate that a lane
			 *	got created or changed. New lanes get
			 *	inserted into the internal data structures,
			 *	already inserted lanes altered.
			 *
			 *	Point values are saved mapped. 
			 *	@see this.mapPoints
			 *
			 *	@param dist The lanes dist
			 *	@type dist Number
			 */
			laneChanged: function (dist) {
				var points, lane, index;

				// TODO
				//	If lanes are only altered, only the changed
				//	value must be transformed again. A generally
				//	more performant way to handle point arrays must
				//	be found.
				//
				lane = this.world.getLane(dist);
				index = _(this.dists).indexOf(dist, true);

				points = this.mapPoints(lane.getPoints());

				// the provided lane is new and must be inserted
				if (index === -1) {
					index = _(this.dists).sortedIndex(dist);
					this.dists.splice(index, 0, dist);
					this.proxy.lanes.splice(index, 0, { 
						color: lane.color(),
						points: points 
					});
				} else {
					this.proxy.lanes[index].points = points;
					this.proxy.lanes[index].color = lane.color();
				}

				this.trigger('update', this.proxy);
				this.clock.mark();
			}


		/**
		 *	Create a new broker.
		 *
		 *	@param world A norne world
		 *	@type world core.world
		 *	@param canvas The context where everything gets drawn to
		 *	@type canvas Element
		 *	@param clock The rendering clock
		 *	@type clock render.clock
		 */
		}, function (world, canvas, clock) {
			var lanechanged;

			this.canvas = canvas;
			this.world = world;
			this.clock = clock;

			this.proxy = { lanes: [] };
			this.dists = [];


			lanechanged = _(this.laneChanged).bind(this);
			this.world.on('laneAdded', lanechanged);
			this.world.on('laneChanged', lanechanged);

		});