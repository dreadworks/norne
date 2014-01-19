
	(function () {


		var exc;

		/**
		 *	Binary search for the index of a lane points x
		 *	coordinate in Array "a" where the returned index
		 *	i is where a[i-1].x < pos and a[i+1].x > pos.
		 */
		function bsearch(a, pos, x, y) {
			x = x || 0;
			y = y || a.length;

			var i = x + Math.floor((y - x) / 2);

			// this catches the cases where
			// either the search found that there is
			// no element in the array smaller than pos
			// or the array is one in size.
			if (i === 0) {
				return (y === 1 && a[0].x < pos) ? 1:0;
			}

			if (i === a.length) {
				return i;
			}

			// searched index got found: return
			if (a[i-1].x < pos && pos < a[i].x) {
				return i;
			}

			// recursive call to search
			// either in the right or left half
			if (a[i-1].x > pos) {
				return bsearch(a, pos, x, i);
			} else {
				return bsearch(a, pos, i+1, y);
			}
		}


		/**
		 *	Point objects describe the height
		 *	of the ground (y) at an arbitrary
		 *	horizontal position (x).
		 */
		var pointfac = norne.obj
			.define('core.lane.point')
			.as({}, function (x, y) {
				this.x = x;
				this.y = y;
			}),


		/**
		 *	Data structure to handle a list
		 *	of points that describe the ground surface.
		 *
		 *	Encapsulates an array, that stays sorted by
		 *	its property x (the horizontal position).
		 */
		groundfac = norne.obj
			.define('core.lane.ground')
			.as({

				add: function (p) {
					var i;
					i = bsearch(this.points, p.x);
					this.points.splice(i, 0, p);
				},

				max: function () {
					return this.points[this.points.length-1];
				},

				get: function (x, y) {
					var i, a;

					if (!_(x).isNumber()) {
						return this.points;
					}

					a = [];
					i = bsearch(this.points, x);
					i = (i === 0) ? 0 : i-1;

					do {
						a.push(this.points[i++]);
					} while (i < this.points.length && this.points[i].x <= y);

					if (this.points[i]) {
						a.push(this.points[i]);
					}

					return a;
				}

			}, function () {

				this.points = [];

			});


		/**
		 *	Lane objects contain all data
		 *	needed to maintain and render
		 *	lanes. They are observable via evt.
		 */
		norne.obj
			.define('core.lane')
			.uses('util.evt')
			.as({

				/**
				 *	Returns the lanes width as absolute
				 *	value without dist as a factor.
				 *	This property can not be set manually
				 *	and is determined by the outermost right
				 *	point of the lanes ground.
				 */				
				width: function () {
					return this.ground.max().x;
				},

				
				/**
				 *	Adds a point to the lane.
				 *
				 *	@param x Absolute x-coordinate
				 *	@type x Number
				 *	@param y Absolute y-coordinate
				 *	@type y Number
				 */
				addPoint: function (x, y) {
					var p = pointfac.create(x, y);
					this.ground.add(p);
					this.trigger('addPoint', p);
				},


				/**
				 *	Get points of the ground, where
				 *	the first point is the next point left
				 *	from position x and the last point the
				 *	next point right from position y.
				 *
				 *	The pixel value takes the dist property
				 *	of the lane in count.
				 *
				 *	@param x {optional} Left delimiter of the range
				 *	@type x Number
				 *	@param y {optional} Right delimiter of the range
				 *	@type y Number
				 */
				getPoints: function (x, y) {
					var points;

					points = this.ground.get(x,y);
					points = _(points).map(function (p) {
						_.each(_(points).keys(), function (x) {



						});

						return p;
					});

					return points;
				}

		/**
		 *	constructor
		 */
		}, function (dist) {

			if (!_(dist).isNumber()) {
				norne.exc.raise(
					'core.lane',
					'You must provide a correct dist argument'
				);
			}

			this.dist = dist;
			this.ground = groundfac.create();

		});

	}());
