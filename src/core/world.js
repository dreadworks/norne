

	
	(function () {

		var exc;
		exc = _(norne.exc.raise).partial('norne');


		// EVENTS
		define('evt.world.widthChanged')
			.as(function (width) {
				this.width = width;
			});

		define('evt.world.depthChanged')
			.as(function (depth) {
				this.depth = depth;
			});

		define('evt.world.rendererChanged')
			.as(function (renderer) {
				this.renderer = renderer;
			});


		// OBJECTS
		/**
		 *	Maintains lanes. Listens to the lanes
		 *	events and delegates those for use by
		 *	the lane broker or other interested parties.
		 */
		define('core.world.lanes')
			.uses('util.evt')
			.as({

				/** 
				 *	Returns true if a lane with the provided
				 *	dist property exists.
				 *
				 *	@param dist The lanes dist
				 *	@type dist Number
				 */
				has: function (dist) {
					return !_(this.lanes[dist]).isUndefined();
				},

				/**
				 *	Get lane with the provided dist property
				 *
				 *	@param dist The lanes dist
				 *	@type dist Number
				 */
				get: function (dist) {
					return this.lanes[dist];
				},

				/**
				 *	Add a lane to the maintainer.
				 *
				 *	@param lane The lane to be added
				 *	@type lane data.lane
				 */				 
				add: function (lane) {
					var that = this;
					this.lanes[lane.dist] = lane;

					lane.on('addPoint', function (point) {
						that.trigger('addPoint', lane, point);
					});
				}

			}, function () {
				this.lanes = {};
			});

		/**
		 *	Instances of core.world represent
		 *	a norne world consisting of lanes,
		 *	a character and decorative elements.
		 */
		define('core.world')
			.uses('util.evt')
			.as({

				/**
				 *	TODO 
				 */
				pos: function () {
					return 0;
				},


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
						exc('The depth must be a value between 0 and 100');
					}

					if (depth) {
						this._depth = depth;
						this.trigger('world.depthChanged', depth);
					}

					return this._depth;
				},


				/**
				 *	Set or get the renderer. The name must be
				 *	a defined renderer, for example "render.canvas".
				 *	The renderers constructor gets passed the proxy
				 *	that describes all elements that get rendered,
				 *	the clock that triggers a "tick" event everytime
				 *	something in the proxy changes and the canvas - an
				 *	HTML-Element where the world should be drawn.
				 *
				 *	If no arguments are provided, the currently set
				 *	renderer gets returned.
				 *
				 *	@param name The renderers name
				 *	@type name String
				 *	@param canvas The element where the world gets drawn to
				 *	@type canvas Element
				 *
				 */
				renderer: function (name, canvas) {
					var that, clock, proxy;

					if (arguments.length === 0) {
						return this.renderer;
					}

					if (!_(canvas).isElement()) {
						exc('setRenderer: no canvas provided');
					}

					that = this;
					clock = create('render.clock',  1000/this.opts.fps);
					this.broker = create('render.broker',  this, canvas, clock);
					proxy = this.broker.proxy;

					// create
					this.renderer = create(
						name, proxy, clock, canvas
					);

					// configure
					this.broker.add(
						'lanes', this.lanes, proxy.lanes
					);

					return this.renderer;
				},


				/**
				 *	Create a new lane. The lane gets appended
				 *	to the world. This function returns the created
				 *	lane instance.
				 *
				 *	@param dist A value that describes how deep in the 
				 *				world the lane appears
				 *	@type dist Number (between 0 and 100)
				 */
				createLane: function (dist) {
					var lane, that;

					if (dist < 0 || 100 < dist) {
						exc('You must provide a correct dist argument');
					}

					if (this.lanes.has(dist)) {
						exc('A lane in dist '+ lane.dist +' is already defined');
					}

					that = this;
					lane = create('data.lane', dist);

					lane.on('lane.addPoint', function (evt) {
						var width;
						width = evt.lane.width();

						if (that._width < width) {
							that._width = width;
							that.trigger('world.widthChanged', width);
						}
					});

					this.lanes.add(lane);
					return lane;
				},


				character: function (opts) {
					// TODO
					return {
						addAnimation: function () {}
					};
				}


			}, function (opts) {

				var defaults = {
					depth: 100,
					fps: 30
				};

				_(defaults).extend(opts);

				// properties
				this.opts = defaults;
				this.depth(this.opts.depth);

				// maintains
				this.lanes = create('core.world.lanes');

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

		}, function (norne, opts) {
			var world = create('core.world', opts);
			this.worlds.push(world);
			// TODO trigger event
			return world;
		});

	}());
