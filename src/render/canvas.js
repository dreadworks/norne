


	(function () {

		var exc;

		exc = _(norne.exc.raise).partial('render.canvas');


	
		/**
		 *	Renders the environment using Context2D
		 */
		norne.obj
			.define('render.canvas')
			.uses('util.evt')
			.as({

				// paints the current state of the world
				repaint: function () {
					var that, character;

					that = this;
					this.clearCanvas();

					// repaint the lanes
					_(this.lanes).each(function (lane) {
						if (lane.points.length) {
							that.laneRenderer.renderLane(lane);
						}
					});

					// repaint character
					this.characterRenderer.render();
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
					'render.lane', this.canvas
				);

				this.characterRenderer = norne.obj.create(
					'render.character', this.canvas
				);

				// create a clock that handles repainting cicles
				this.clock = norne.obj.create(
					'render.clock', opts.delay
				);

				// create broker that handles data caching and preparation
				this.broker = norne.obj.create(
					'render.broker', opts.world, this.canvas, this.clock
				);

				// TODO find a better approach
				this.lanes = this.broker.proxy.lanes;

				// everytime the clock ticks, a repaint is issued
				this.clock.on('tick', _(this.repaint).bind(this));
			});

	}());



