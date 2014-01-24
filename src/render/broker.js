
    (function () {

        var lanebroker, charbroker;

        /**
         *  The broker that handles proxy.lanes
         */
        lanebroker = define('render.broker.lanes')
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


                getIndex: function (dist, reversed) {
                    var index = _(this.dists).indexOf(dist, true);
                    return (reversed === true) ?
                        this.proxy.length - index - 1 : index;
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
                 *  
                 *
                 *  TODO implement range based caching.
                 */
                 updatePoints: function (dist, force) {
                    var cache, a, b, points, offset;

                    a = this.range.a;
                    b = this.range.b;
                    cache = this.lanes.cache;
                    offset = this.offset(dist);

                    // if no update is forced, ask the cache
                    if (force !== true) {
                        if (cache[dist].a < a && b < cache[dist].b) {

                            // use the points saved in the proxy
                            // upon cache hits
                            points = this.proxy[this.getIndex(dist, true)];

                            // apply offset
                            points.points = _(points.points).map(function (p) {
                                return { y: p.y, x: p.x + offset };
                            });

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

                    // apply offset
                    points = _(points).map(function (p) {
                        return { y: p.y, x: p.x + offset };
                    });

                    this.updateProxy(points, dist);
                 },


                 /**
                  * Takes a list of points, maps them and
                  * inserts them into the proxy.
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



        /**
         *  The broker that handles proxy.character
         */
        charbroker = define('render.broker.character')
            .uses('util.evt')
            .as({

                // TODO auto-generated method stub :)

            }, function () {

            });



        /**
         *  Instances of this object sit between /core and /render.
         *  They handle calculations to transform pixel values handed
         *  from core.world to viewport pixel values. They also serve
         *  as a cache for retrieved values.
         */
        define('render.broker')
            .uses('util.evt')
            .as({

                /**
                 *  Add a new subbroker to work on a set of data.
                 *  You can pass an arbitrary set of arguments
                 *  that will get passed through to the subbrokers
                 *  constructor function. The broker listens on a
                 *  a subbrokers 'update' event to initiate a repaint
                 *  of the canvas.
                 *
                 *  @param name Object definition: render.broker.<name>
                 *  @type name String
                 */
                add: function (name) {
                    var args, subbroker;

                    args = _(arguments).toArray();
                    args.shift();

                    args.unshift(this);
                    args.unshift('render.broker.' + name);

                    subbroker = create.apply(norne.obj, args);

                    this.broker[name] = subbroker;
                    subbroker.on('update', this.render);
                }

            /**
             *  Create a new broker.
             *
             *  @param world A norne world
             *  @type world core.world
             *  @param canvas The context where everything gets drawn to
             *  @type canvas Element
             *  @param clock The rendering clock
             *  @type clock render.clock
             */
            }, function (world, canvas, clock) {

                this.canvas = canvas;
                this.world = world;
                this.render = _(clock.mark).bind(clock);

                this.proxy = {
                    lanes: []
                };

                this.broker = {};

            });
    }());