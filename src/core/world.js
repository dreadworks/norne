

    
    (function () {

        var exc;
        exc = _(norne.exc.raise).partial('norne');


        /**
         *  ENVIRONMENT
         *  ===========
         */
        define('core.world.env').as({

            /**
             *  Getter and setter for the depthfactor
             *  used to map points.
             *
             *  @param depth The worlds depth
             *  @type depth Number
             */
            depthfactor: function (depth) {

                if (!depth) {
                    return this._depthfactor || 0;
                }

                this._depthfactor = (depth < 10 || 100 < depth) ? 
                    0 : 100/depth;

                return this._depthfactor;
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


            /**
             *  Map the provided value based on
             *  the lanes dist and the worlds depth.
             *  Creates a new point object.
             *
             *  @param dist The lanes dist
             *  @type dist Number
             *  @param p Either an object with x and y 
             *           properties or a number.
             *  @type p Object or Number
             */
            map: function (dist, p) {
                var depthfactor, distfactor, x;

                x = (p.x === undefined) ? p : p.x;

                distfactor = (100-dist) / 100;
                depthfactor = this.depthfactor() * x;
                x = depthfactor + distfactor * (x - depthfactor);

                if (_(p).isNumber()) {
                    return x;
                }

                return {
                    x: x,
                    y: this.canvas.offsetHeight - p.y
                };
            },


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

                    

                    if (this.character()) {
                        var points = this.character().lane.getPoints();
                        var bezier = create('util.bezier', points);
                        var y = bezier.getY(pos);
                        this.character().setPos(this.width() / 2, y);
                    }
                }

                return this._pos;
            }

        });



        /**
         *  RENDERER
         *  ========
         */
         define('core.world.renderer').as({

            /**
             *  Returns the current canvas height
             */
            height: function () {
                return (this._renderer) ? this._renderer.canvasHeight() : 0;
            },

            /**
             *  Returns the current canvas width
             */
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
                this.canvas = canvas;
                proxy = this.broker.proxy;

                // create
                this._renderer = create(
                    'render.world', proxy, clock, canvas
                );

                // configure
                this.broker.add('lanes', this.lanes);
                return this._renderer;
            }

        });



        /**
         *  LANES
         *  =====
         */
        define('core.world.lanes').as({

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
        });



        /**
         *  CHARACTER
         *  =========
         */
         define('core.world.character').as({

            /**
             *  TODO (luhuec) comment
             */
            character: function (opts) {
                var that;

                if (arguments.length === 0) {
                    return this.charact;
                }

                this.charact = create('data.character', opts);

                this.broker.add(
                        'character',
                        this.charact,
                        this.broker.proxy.character
                    );

                return this.charact;
            },


            /**
             *  Puts the character on a lane
             * 
             *  @param dist The chosen lane
             *  @type dist Number
             */
            put: function (dist) {
                var lane;

                if (!this.character()) {
                    exc('You must provide a character first');
                }

                if (!this.lanes.has(dist)) {
                    exc('Theres no lane at dist ' + dist);
                }

                lane = this.lanes.get(dist);
                this.character().lane = lane;

                return this.character;
            }

         });



        /**
         *  Instances of core.world represent
         *  a norne world consisting of lanes,
         *  a character and decorative elements.
         */
        define('core.world')
            .uses(
                'util.evt',
                'core.world.env',
                'core.world.renderer',
                'core.world.lanes',
                'core.world.character')
            .as(
                function (opts) {
                    var defaults = {
                        depth: 100,
                        fps: 30,
                        pos: 0
                    };

                    _(defaults).extend(opts);

                    // properties
                    this.opts = defaults;

                    // maintains
                    this.lanes = create('data.lanes');

                    // configure
                    this.depth(this.opts.depth);
                    this.pos(this.opts.pos);
                    this.renderer(this.opts.canvas);
                }
            );

    }());
