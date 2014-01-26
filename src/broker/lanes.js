
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



            offset: function (dist, pos) {
                return -this.mapPoint(dist, pos);
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
                    0 : 10/depth;

                return this._depthfactor;
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
            mapPoint: function (dist, p) {
                var depthfactor, distfactor, x;

                x = (p.x === undefined) ? p : p.x;

                distfactor = (100-dist) / 100;
                depthfactor = this.depthfactor() * x;
                x = depthfactor + distfactor * (x - depthfactor);

                if (_(p).isNumber()) {
                    return x;
                }

                console.log('mapped', p.x, 'to', x, 
                    'depthfactor: ', depthfactor, 
                    'distfactor', distfactor
                );
                return {
                    x: x,
                    y: this.parent.canvas.offsetHeight - p.y
                };
            },



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

                //console.log('updateProxy', range.a, range.b, offset);

                a = points.sortedIndex({x:range.a}, 'x') - 1;
                a = (0 < a) ? a : 0;

                b = points.sortedIndex({x:range.b}, 'x') + 1;

                // insert
                points = this.cache[dist].slice(a, b);
                index = this.index(dist, true);
                offset = this.offset(dist, range.a);

                // applying offset
                //console.log('apply offset', range, offset);
                points = _(points).map(function (p) {
                    return { x: p.x + offset, y: p.y };
                });

                this.proxy[index].points = points;
                this.trigger('update');
            },


            updateCache: function (dist) {
                var that, cache, lane, index;
                //console.info('updateCache with ', dist);

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
             *  @see this.mapPoints
             *
             *  TODO implement ranged based caching.
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
                        color: lane.color(),
                        points: []
                    });
                }

                // mapping and insertion
                cache = this.cache[dist];
                point = this.mapPoint(dist, point);

                cache.splice(index, 0, point);
                this.updateProxy(dist);
            }


        }, function (parent, lanes) {
            var that, world;

            that = this;
            world = parent.world;

            this.lanes = lanes;
            this.parent = parent;
            this.proxy = parent.proxy.lanes;

            this.dists = [];
            this.cache = {};

            // privates
            this._range = {};
            this.range(
                parent.world.pos(),
                parent.world.pos() + parent.world.width()
            );


            // event handler
            this.lanes.on('addPoint', function (lane, point, index) {
                that.addPoint(lane, point, index);
            });

            world.on('depthChanged', function (depth) {
                that.depthfactor(depth);
                that.updateCache();
                that.updateProxy(true);
            });

            world.on('posChanged', function (pos, width) {
                that.range(pos, pos+width);
                that.updateProxy();
            });
        });
