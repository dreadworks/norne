    /**
     *  The broker that handles proxy.lanes
     */
    define('broker.lanes')
        .uses('util.evt')
        .as({


            /**
             *  The offset describes the relative
             *  shift of any lane based on its
             *  distance.
             */
            offset: function (dist) {
                var offset = this.range.a - this.range.a_old;
                offset = this.mapPoint(offset, dist);
                return -offset;
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
             *  Returns the index on which the lane
             *  is saved in the proxy object.
             *
             *  @param dist The lanes dist
             *  @type dist Number
             *  @param reversed Whether the elements are 
             *         sorted in reverse order
             *  @type reversed Boolean
             */
            getIndex: function (dist, reversed) {
                var index = _(this.dists).indexOf(dist, true);
                return (reversed === true) ?
                    this.proxy.length - index - 1 : index;
            },


            /**
             *  Apply an relative offset to all x values 
             *  of the lane in the proxy at the specified dist.
             *
             *  @param dist The lanes dist
             *  @type dist Number
             *  @param offset Relative offset
             *  @type offset Number
             */
            applyOffset: function (dist, offset) {
                var points = this.proxy[this.getIndex(dist, true)];
                points.points = _(points.points).map(function (p) {
                    return { y: p.y, x: p.x + offset };
                });
            },


            /**
             *  Map the provided value based on
             *  the lanes dist and the worlds depth.
             *
             *  @param x The value to be mapped
             *  @type x Number
             *  @param distfactor The lanes distfactor
             *  @type distfactor Number
             */
            mapPoint: function (x, dist) {
                var depthfactor, distfactor;

                distfactor = (100-dist) / 100;
                depthfactor = this.depthfactor() * x;

                return depthfactor + distfactor * (x - depthfactor);
            },

            /**
             *  This method translates the absolute pixel
             *  values delivered by the world to relative pixel
             *  values as seen by the canvas.
             *  This means that the users virtual position in the
             *  world must be factored in for x-values. Also, the
             *  y-values must be inverted to show lanes bottom up.
             *
             *  @param points Objects with x and y properties.
             *  @type points Array
             */
            mapPoints: function (points, dist) {
                var that, height, offset;
                console.log('mapping points');

                that = this;
                height = this.parent.canvas.offsetHeight;

                return _(points).map(function (p) {
                    return {
                        x: that.mapPoint(p.x, dist),
                        y: height - p.y
                    };
                });
            },


            /**
             *  If force is not true, this method
             *  decides whether or not the proxy must
             *  be updated.
             *
             *  @param dist The lanes dist
             *  @type dist Number
             *  @param force Force update the points
             *  @type force Boolean
             */
             updatePoints: function (dist, force) {
                var cache, a, b, points, offset;

                a = this.range.a;
                b = this.range.b;
                cache = this.lanes.cache;
                offset = this.offset(dist);

                // if no update is forced, ask the cache
                if (force !== true) {
                    if (cache[dist].a < a || b < cache[dist].b) {

                        // use the points saved in the proxy
                        // upon cache hits
                        this.applyOffset(dist, offset);
                        this.trigger('update');
                        return;

                    } else { 
                        // retrieve points and update the cache
                        points = this.lanes.get(dist).getPoints(a, b);
                        cache[dist].a = _(points).first().x;
                        cache[dist].b = _(points).last().x;
                    }
                } else {
                    points = this.lanes.get(dist).getPoints(a, b);
                }

                this.applyOffset(offset);
                this.updateProxy(points, dist);
             },


             /**
              *  Takes a list of points, maps them and
              *  inserts them into the proxy.
              *
              *  @param points Points to be inserted
              *  @type points Array
              *  @param dist The lanes dist
              *  @type dist Number
              */
             updateProxy: function (points, dist) {
                var index;

                points = this.mapPoints(points, dist);
                index = this.getIndex(dist, true);
                this.proxy[index].points = points;
                this.trigger('update');
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
             *  @param dist The lanes dist
             *  @type dist Number
             */
            pointAdded: function (lane, point) {
                var index;

                index = this.getIndex(lane.dist);
                if (index === -1) {

                    // find index, where the new dist must be inserted
                    index = _(this.dists).sortedIndex(lane.dist);

                    // insert into the data structures
                    this.dists.splice(index, 0, lane.dist);

                    // reverse the order for painting
                    index = this.getIndex(lane.dist, true);
                    this.proxy.splice(index, 0, { 
                        color: lane.color()
                    });

                    // create cache object
                    this.lanes.cache[lane.dist] = {};

                }

                this.updatePoints(lane.dist, true);
            }

        }, function (parent, lanes) {
            var that = this;

            this.parent = parent;
            this.dists = [];
            this.lanes = lanes;
            this.proxy = parent.proxy.lanes;

            // ground updates
            this.lanes.on('addPoint', _(this.pointAdded).bind(this));

            // visual depth of the world
            parent.world.on('depthChanged', _(this.depthfactor).bind(this));
            this.depthfactor(parent.world.depth());

            // movement inside the world
            parent.world.on('posChanged', function (pos, width) {
                
                that.offset(pos);
                that.range = { a: pos, b: pos+width, a_old: that.range.a };

                _(that.dists).each(function (dist) {
                    that.updatePoints(dist);
                });
            });

            this.range = {
                a: parent.world.pos(),
                b: parent.world.pos() + parent.world.width(),
                a_old: 0
            };
        });
