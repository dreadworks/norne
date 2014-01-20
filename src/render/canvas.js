

	(function () {

		var exc;

		exc = _(norne.exc.raise).partial('render.canvas');


		/*
		 * Renderer for lanes
		 */
		norne.obj
			.define('render.canvas.lane')
			.as({

				// renders a single lane
				renderLane: function (lane) {
					var color = lane.color,
						points = lane.points;

					this.paintLane(points, color);
					this.fillLane(points, color);
					this.fillStroke(color);
				},

				// paints the path for a lane
				paintLane: function (points, color) {
					if (!points) {
						return;
					}

					this.ctx.beginPath();
					this.ctx.moveTo(points[0].x, points[0].y);

					// cut off the first element
					points = _.rest(points);
					// add the last point till the amount is
					// a multiple of 3. HTML5 can only paint
					// curves with 3 points
					while (points.length % 3 !== 0) {
						points.push(_.last(points));
					}

					console.log('lane.paintLane: points to draw', points);

					for (var i = 0; i < points.length / 3; i += 3) {
						console.log('lane.paintLane: drawing ',
							points[i].x,
							points[i].y,

							points[i+1].x,
							points[i+1].y,

							points[i+2].x,
							points[i+2].y
						);

						this.ctx.bezierCurveTo(
								points[i].x,
								points[i].y,

								points[i+1].x,
								points[i+1].y,

								points[i+2].x,
								points[i+2].y
							);
					}

					this.ctx.lineTo(this.canvas.width+10, this.canvas.height+10);
					this.ctx.lineTo(-10, this.canvas.height+10);
					this.ctx.closePath();
				},

				// paints the lane body with
				// a linear gradient. the top of the
				// body will have a darkened version
				// of the given color
				fillLane: function (points, color) {
					//var lingrand = this.linearGradient(points, color);
					this.ctx.fillStyle = 'rgb(200, 200, 200)';//lingrand;
					this.ctx.fill();
				},

				// fills the top stroke of a lane
				// with a much darkened version of
				// the given color
				fillStroke: function (color) {
					this.ctx.strokeStyle = this.shadeColor(color, -50);
					this.ctx.lineWidth = 3;
					this.ctx.stroke();
				},

				// shades a color given by percentage
				// shadeColor(..., -40) will darken the color
				// by 40%
				shadeColor: function (color, perc) {
					var r, g, b, num;

					num = parseInt(color, 16);

					r = parseInt((num >> 16) * (100 + perc) / 100);
					g = parseInt(((num >> 8) & 0x00FF) * (100 + perc) / 100);
					b = parseInt((num & 0x0000FF) * (100 + perc) / 100);

					if (r > 255) { r = 255; }
					else if (r < 0) { r = 0; }
					if (g > 255) { g = 255; }
					else if (g < 0) { g = 0; }
					if (b > 255) { b = 255; }
					else if (b < 0) { b = 0; }

					return ((g << 8) | (b) | (r << 16)).toString(16);
				},

				// Creates a LinearGradient out of the given
				// points. Needed to get the y-position of
				// the highest and lowest point
				linearGradient: function (points, color) {
					var x1=0, y1, x2=0,
						y2=this.canvas.height+10,
						lingrand;

					y1 = _.min(points, function (point) {
						return point[1];
					})[1];

					lingrand = this.ctx.createLinearGradient(x1, y1, x2, y2);
					lingrand.addColorStop(0, this.shadeColor(color, -40));
					lingrand.addColorStop(1, color);

					return lingrand;
				}

			}, function (canvas) {

				this.canvas = canvas;
				this.ctx = canvas.getContext('2d');

			});



		/**
		 *	Renders the environment using Context2D
		 */
		norne.obj
			.define('render.canvas')
			.uses('util.evt')
			.as({

				// paints the current state of the world
				repaint: function () {
					console.log('canvas: repaint');
					var that, lanes, character;

					that = this;
					this.clearCanvas();

					// repaint the lanes
					lanes = this.broker.proxy.lanes;
					_(lanes).each(function (lane) {
						if (lane.points.length) {
							that.laneRenderer.renderLane(lane);
						}
					});
				},


				/**
				 *	Creates a canvas HTML-Element and sets
				 *	this.canvas and this.ctx. The width and height
				 *	of the canvas element are determined by the
				 *	width and height of the provided wrapper.
				 *
				 *	@param wrapper HTML-Element that will contain the canvas
				 *	@type wrapper Element
				 */
				setCanvas: function (wrapper) {
					var c = document.createElement('canvas');
					c.setAttribute('height', wrapper.offsetHeight);
					c.setAttribute('width', wrapper.offsetWidth);
					wrapper.appendChild(c);

					this.canvas = c;
					this.ctx = this.canvas.getContext('2d');
				},


				// clears the whole canvas to paint
				// the new state
				clearCanvas: function () {
					this.ctx.clearRect(
						0, 0,
						this.canvas.width,
						this.canvas.height
					);
				}

			/**
			 *
			 *	@param canvas where the environment gets rendered
			 *	@type canvas HTMLElement
			 */
			}, function (opts) {

				this.setCanvas(opts.canvas);
				this.laneRenderer = norne.obj.create(
					'render.canvas.lane', this.canvas
				);

				// create a clock that handles repainting cicles
				this.clock = norne.obj.create(
					'render.clock', opts.delay
				);

				// create broker that handles data caching and preparation
				this.broker = norne.obj.create(
					'render.broker', opts.world, this.canvas, this.clock
				);

				// everytime the clock ticks, a repaint is issued
				this.clock.on('tick', _(this.repaint).bind(this));
			});

	}());


