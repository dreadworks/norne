
    (function () {

        var lanebroker, charbroker;

        /**
         *  The broker that handles proxy.lanes
         */
        lanebroker = define('render.broker.lanes')
            .uses('util.evt')
            .as({


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

                    this._depthfactor = (depth <= 0 || 100 < depth) ? 
                        0 : 10/depth;

                    return this._depthfactor;
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
                mapPoint: function (x, distfactor) {
                    var depthfactor;

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
                mapPoints: function (points, distfactor) {
                    var that, height, pos;

                    that = this;

                    pos = -this.parent.world.pos();
                    height = that.parent.canvas.offsetHeight;

                    return _(points).map(function (p) {
                        return {
                            x: pos + that.mapPoint(p.x, distfactor),
                            y: height - that.mapPoint(p.y, distfactor)
                        };
                    });
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
                 *
                 *  TODO implement range based caching.
                 */
                pointAdded: function (lane, point) {
                    var points, index, distfactor;

                    distfactor = (100-lane.dist) / 100;
                    index = _(this.dists).indexOf(lane.dist, true);
                    points = this.mapPoints(lane.getPoints(), distfactor);

                    console.log('broker.pointAdded', this.dists, index);
                    if (index === -1) {
                        // find index, where the new dist must be inserted
                        index = _(this.dists).sortedIndex(lane.dist);

                        // insert into the data structures
                        this.dists.splice(index, 0, lane.dist);

                        // reverse the order for painting
                        index = this.proxy.length - index - 1;
                        this.proxy.splice(index, 0, { 
                            color: lane.color(),
                            points: points 
                        });

                    } else {

                        index = this.proxy.length - index - 1;
                        _(this.proxy[index]).extend({
                            points: points,
                            color: lane.color()
                        });
                    }

                    console.log('points: ', this.proxy);
                    this.trigger('update');
                }

            }, function (parent, lanes) {
                var that = this;

                this.parent = parent;
                this.dists = [];
                this.lanes = lanes;
                this.proxy = parent.proxy.lanes;

                this.depthfactor(parent.world.depth());

                this.lanes.on('addPoint', _(this.pointAdded).bind(this));

                parent.world.on('world.depthChanged', function (evt) {
                    this.depthfactor(evt.depth);
                });
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