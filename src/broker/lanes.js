
    define('broker.lanes')
        .uses('util.evt')
        .as({

            /**
             *  Returns the index on which the lane
             *  is saved in the proxy object.
             *
             *  @param dist The lanes dist
             *  @type dist Number
             *  @param reversed Whether the elements are 
             *         sorted in reverse order
             *  @type reversed Boolean
             */
            index: function (dist, reversed) {
                var index = _(this.dists).indexOf(dist, true);
                return (reversed === true) ?
                    this.dists.length - index - 1 : index;
            },


            /** 
             *  Calculates the relative offset based
             *  on the worlds position and the dist.
             *
             *  @param dist The lanes dist
             *  @type dist Number
             *  @param x The position
             *  @type x Number
             */
            offset: function (dist, x) {
                return -this.world.map(dist, x);
            },


            /**
             *  Sets or gets the current range on
             *  the x-axis. Used to determine which
             *  points must be held inside the proxy.
             *
             *  @param a (optional) Left range delimiter
             *  @type a Number
             *  @param b (optional) Right range delimiter
             *  @type b Number
             */
            range: function (a, b) {
                if (_.isNumber(a) && _.isNumber(b)) {
                    this._range = {
                        a: a, b: b, 
                        a_old: (this._range.a === undefined) ? a : this._range.a
                    };
                }

                return this._range;
            },


            /** 
             *  Gets a subset of the cache for rendering
             *  and saves that to the proxy. The offset
             *  gets calculated and added. If the dist
             *  argument gets omitted, all lanes are updated.
             *
             *  @param dist (Optional) The lanes dist
             *  @type dist Number
             */
            updateProxy: function (dist) {
                var index, points, range, offset, a, b, p;

                if (!_.isNumber(dist)) {
                    a = this;
                    _(this.dists).each(function (d) {
                        a.updateProxy(d);
                    });

                    return;
                }

                range = this.range();
                points = _(this.cache[dist]);
                offset = this.offset(dist, range.a);

                a = this.world.map(dist, range.a);
                b = range.b;

                // retrieve indexes for slicing
                a = points.sortedIndex({x:a}, 'x') - 1;
                a = (0 < a) ? a : 0;

                b = points.sortedIndex({x:b}, 'x') + 2;

                // insert
                points = this.cache[dist].slice(a, b);
                index = this.index(dist, true);
                offset = this.offset(dist, range.a);

                // applying offset
                points = _(points).map(function (p) {
                    return { x: p.x + offset, y: p.y };
                });

                this.proxy[index].points = points;
                this.trigger('update');
            },


            /**
             *  Recalculates the cache when outside
             *  variables like world.depth() change.
             *  If the dist argument gets omitted,
             *  all lane caches are recalculated.
             *
             *  TODO #7
             *
             *  @param dist (optional) The lanes dist
             *  @type dist Number
             */
            updateCache: function (dist) {
                var that, cache, lane, index;

                that = this;
                if (!_.isNumber(dist)) {
                    _(this.dists).each(function (d) {
                        that.updateCache(d);
                    });
                    return;
                }

                lane = this.lanes.get(dist);
                cache = this.cache[dist];

                // clear old items
                // and repopulate the cache
                while (cache.length > 0) { cache.pop(); }
                _(lane.getPoints()).each(function (p,i) {
                    that.addPoint(lane, p, i);
                });
            },


            /**
             *  The broker handles lanes only if
             *  they contain actual points to render.
             *  So if the first point gets added,
             *  the lane must be inserted into the brokers
             *  data structures.
             *
             *  @param dist The lanes dist
             *  @type dist Number
             *  @param laneproxy The lanes proxy equivalent
             *  @type laneproxy Object
             *
             */
            createEntry: function (dist, laneproxy) {
                var index;

                // create a cache entry
                this.cache[dist] = [];

                // insert dist into the dists reference
                index = _(this.dists).sortedIndex(dist);
                this.dists.splice(index, 0, dist);

                // create proxy entry
                index = this.index(dist, true);
                this.proxy.splice(index, 0, laneproxy);
            },


            /**
             *  This method gets called when the world
             *  fires events that indicate that a lane
             *  got created or changed. New lanes get
             *  inserted into the internal data structures,
             *  already inserted lanes altered.
             *
             *  Point values are saved mapped. 
             *  @see world.map
             *
             *  @param dist The lanes dist
             *  @type dist Number
             *  @param point The point that got inserted
             *  @type point Object
             *  @param index The position of the point
             *  @type index Number
             */
            addPoint: function (lane, point, index) {
                var dist, cache, range;
                dist = lane.dist;

                // the lane got newly created
                if (this.index(dist) === -1) {
                    this.createEntry(dist, {
                        dist: lane.dist,
                        color: lane.color(),
                        points: []
                    });
                }

                // mapping and insertion
                cache = this.cache[dist];
                point = this.world.map(dist, point);

                cache.splice(index, 0, point);
                this.updateProxy(dist);
            },



            changeRenderer: function (dist, renderer) {
                console.log('changing renderer on', dist, 'to', renderer);
            }


        /**
         *  Constructor
         *
         *  @param parent The parent broker
         *  @type parent broker.world
         *  @param lanes The lanes collection
         *  @type lanes data.lanes
         */
        }, function (parent, lanes) {
            var that, world;

            that = this;
            world = parent.world;

            // shortcuts
            this.lanes = lanes;
            this.proxy = parent.proxy.lanes;
            this.world = parent.world;

            // maintainer
            this.dists = [];
            this.cache = {};

            // privates
            this._range = {};
            this.range(
                world.pos(),
                world.pos() + world.width()
            );

            // event handler
            this.lanes.on('addPoint', function (lane, point, index) {
                that.addPoint(lane, point, index);
            });

            this.lanes.on('rendererChanged', function (lane, renderer) {
                that.changeRenderer(lane.dist, renderer);
            });

            world.on('depthChanged', function (depth) {
                that.updateCache();
                that.updateProxy(true);
            });

            world.on('angleChanged', function (angle) {
                that.updateCache();
                that.updateProxy(true);
            });

            world.on('posChanged', function (pos, width) {
                that.range(pos, pos+width);
                that.updateProxy();
            });
        });
