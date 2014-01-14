
	(function (world) {


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

				points: [],

				add: function (p) {
					var i = bsearch(this.points, p.x);
					this.points.splice(i, 0, p);
				},

				max: function () {
					return this.points[this.points.length-1];
				}

			});


		norne.obj
			.define('core.lane')
			.uses('evt')
			.as({

				width: function () {
					return this.ground.max().x;
				},

				addPoint: function (x, y) {
					var p = pointfac.create(x, y);
					this.ground.add(p);
					this.trigger('addPoint', p);
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

	}(norne.world));
