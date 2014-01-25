

    
    (function () {

        var exc;
        exc = _(norne.exc.raise).partial('norne');


        // OBJECTS
        /**
         *  Maintains lanes. Listens to the lanes
         *  events and delegates those for use by
         *  the lane broker or other interested parties.
         */
        define('core.world.lanes')
            .uses('util.evt')
            .as({

                /** 
                 *  Returns true if a lane with the provided
                 *  dist property exists.
                 *
                 *  @param dist The lanes dist
                 *  @type dist Number
                 */
                has: function (dist) {
                    return !_(this[dist]).isUndefined();
                },

                /**
                 *  Get lane with the provided dist property
                 *
                 *  @param dist The lanes dist
                 *  @type dist Number
                 */
                get: function (dist) {
                    return this[dist];
                },

                /**
                 *  Add a lane to the maintainer.
                 *
                 *  @param lane The lane to be added
                 *  @type lane data.lane
                 */              
                add: function (lane) {
                    var that = this;
                    this[lane.dist] = lane;

                    lane.on('addPoint', function (point) {
                        that.trigger('addPoint', lane, point);
                    });
                },


                /**
                 *  Remove the lane in distance <dist>
                 *
                 *  @param dist The lanes dist
                 *  @type dist Number
                 */
                del: function (dist) {

                    if (delete this[lane.dist]) {
                        this.trigger('removeLane', dist);
                        return true;
                    }

                    return false;
                }

            }, function () {
                // maintained by broker.lanes
                this.cache = {};
            });


        /**
         *  Instances of core.world represent
         *  a norne world consisting of lanes,
         *  a character and decorative elements.
         */
        define('core.world')
            .uses('util.evt')
            .as({

                /**
                 *  Gets or sets the current position in the world.
                 *  
                 *  @param pos (optional) New position in the world
                 *  @type pos Number
                 */
                pos: function (pos) {
                    if (_(pos).isNumber()) {
                        this._pos = pos;
                        this.trigger('posChanged', pos, this.width());
                    }

                    return this._pos;
                },


                /**
                 *  This gets or sets the worlds depth.
                 *  It describes how deep or flat the world
                 *  appears. If the depth is 100, the lane
                 *  will be scaled by the factor 10. With
                 *  depth 10, no lane gets scaled.
                 *
                 *  @param depth (optional) Value between 10 and 100
                 *  @type depth Number
                 */
                depth: function (depth) {
                    if (depth < 0 || 100 < depth) {
                        exc('The depth must be a value between 0 and 100');
                    }

                    if (depth) {
                        this._depth = depth;
                        this.trigger('depthChanged', depth);
                    }

                    return this._depth;
                },


                width: function () {
                    return (this._renderer) ? this._renderer.canvasWidth() : 0;
                },


                /**
                 *  Set or get the renderer. The name must be
                 *  a defined renderer, for example "render.canvas".
                 *  The renderers constructor gets passed the proxy
                 *  that describes all elements that get rendered,
                 *  the clock that triggers a "tick" event everytime
                 *  something in the proxy changes and the canvas - an
                 *  HTML-Element where the world should be drawn.
                 *
                 *  If no arguments are provided, the currently set
                 *  renderer gets returned.
                 *
                 *  @param name The renderers name
                 *  @type name String
                 *  @param canvas The element where the world gets drawn to
                 *  @type canvas Element
                 *
                 */
                renderer: function (canvas) {
                    var that, clock, proxy;

                    if (arguments.length === 0) {
                        return this.renderer;
                    }

                    if (!_(canvas).isElement()) {
                        exc('renderer: no canvas provided');
                    }

                    that = this;
                    clock = create('util.clock',  1000/this.opts.fps);
                    this.broker = create('broker.world',  this, canvas, clock);
                    proxy = this.broker.proxy;

                    // create
                    this._renderer = create(
                        'render.world', proxy, clock, canvas
                    );

                    // configure
                    this.broker.add(
                        'lanes', this.lanes
                    );

                    return this._renderer;
                },


                /**
                 *  Create a new lane. The lane gets appended
                 *  to the world. This function returns the created
                 *  lane instance.
                 *
                 *  @param dist A value that describes how deep in the 
                 *              world the lane appears
                 *  @type dist Number (between 0 and 100)
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

                    this.lanes.add(lane);
                    return lane;
                },


                /**
                 *  Remove a lane from the world.
                 *  
                 *  @param dist The lanes dist
                 *  @type dist Number
                 */
                removeLane: function (dist) {
                    return this.lanes.del(dist);
                },


                character: function (opts) {
                    var that;

                    if (arguments.length === 0) {
                        return this.character;
                    }

                    this.character = create('data.character', opts);

                    this.broker.add(
                        'character',
                        this.character,
                        this.broker.proxy.character
                    );

                    return this.character;
                }


            }, function (opts) {
                var defaults = {
                    depth: 100,
                    fps: 30,
                    pos: 0
                };

                _(defaults).extend(opts);

                // properties
                this.opts = defaults;

                // maintains
                this.lanes = create('core.world.lanes');

                // configure
                this.depth(this.opts.depth);
                this.pos(this.opts.pos);
                this.renderer(this.opts.canvas);

            });

    }());
