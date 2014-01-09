(function (norne) {

	var lane;



	/**
	 *	binary search for the index of a lane
	 *	in Array "a" where pos is between
	 *	a[i].x and a[i+1].x.
	 */
	function bsearch(a, pos, x, y) {
		x = x || 0;
		y = y || a.length;

		var i = x + Math.floor((y - x) / 2);

		// exit conditions
		// TODO: maybe this can be solved... nicer
		if (i === 0) {
			return 0;
		}

		if (a[i-1].x < pos && pos < a[i].x) {
			return i-1;
		}

		if (i === a.length-1) {
			return a.length;
		}

		if (a[i-1].x > pos) {
			// search in left half
			return bsearch(a, pos, x, i);
		} else {
			// search in right half
			return bsearch(a, pos, i+1, y);
		}
	}



	lane = norne.obj.define('world.lane').use(
		norne.evt
	).as({

		exc: _({}).extend(norne.exception, {
			name: 'norne.lane.lane instance'
		}),


		points: [],



		/**
		 *	Gets or sets a new position as the relative
		 *	distance of the viewer from that lane.
		 *
		 *	@param pos Optional. A value between 0 and 100.
		 */
		distance: function (dist) {
			if (!dist) {
				return this.dist;
			}

			if (0 <= dist && dist <= 100) {
				this.dist = dist;
			} else {
				throw _(this.exc).extend({
					message: 'Please provide a float between 0 and 100'
				});
			}
		},


		/**
		 *
		 *
		 *
		 */
		offset: function (pos) {
			return (100 - this.distance() / 100) * pos;
		},


		/**
		 *	Returns the width of a lane in px.
		 *
		 *	The width of a lane must be calculated and can not be
		 *	set directly. This is due to the fact, that the lanes
		 *	width is depending on the virtual distance of the viewer
		 *	and the outermost right point of an arbitrary lane.
		 *
		 *	@returns Width of the lane
		 */
		width: function () {
			/*
			 *	We need a function that behaves as follows:
			 *		width(dist=0) = world.width
			 *		width(dist=100) = viewport.width
			 *
			 *	w := width of the world
			 *	v := width of the viewport
			 *	d := distance
			 *
			 *	=> width(d) = d(v-w)/100 + w
			 * 
			 */
			var world = norne.world, v, w, x;
			v = world.viewportWidth();
			w = world.worldWidth();

			x = this.distance() * (v - w);
			return x / 100 + w;
		},


		addPoint: function () {
			var points = this.points;
			_(arguments).each(function (p) {
				
				var i = bsearch(points, p.x);
				points.splice(i, 0, p);

			});
		},


		getPoints: function (pos) {
			var i,
				cpoints = [],
				points = this.points,
				right = pos + norne.world.viewportWidth();

			i = bsearch(points, pos) - 1;

			do {
				i += 1;
				cpoints.push(points[i]);
			} while (points[i+1] && points[i].x < right);

			return cpoints;
		}

	});


	/**
	 *
	 *
	 *
	 *
	 */
	norne.register('lane', {

		exc: _(norne.exception).extend({
			name: 'norne.lane'
		}),

		create: function (opts) {
			lane = _(norne.obj.create('world.lane')).extend(opts);
			lane.distance(lane.dist);
			return lane;
		}

	});

}(norne));