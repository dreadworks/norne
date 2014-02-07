
    (function () {


        var exc, colorregex, ground;

        exc = _(norne.exc.raise).partial('data.lane');
        colorregex = /[0-9a-f]{6}/i;
        

        // OBJECTS
        /**
         *  Data structure to handle a list
         *  of points that describe the ground surface.
         *
         *  Encapsulates an array, that stays sorted by
         *  its property x (the horizontal position).
         */
        ground = define('data.lane.ground')
            .as({

                add: function (p) {
                    var i;
                    i = _(this.points).sortedIndex(p, 'x');
                    this.points.splice(i, 0, p);
                    return i;
                },

                max: function () {
                    return this.points[this.points.length-1];
                },

                get: function (x, y) {
                    var arr, a, b, points;

                    if (!_(x).isNumber()) {
                        return this.points;
                    }

                    points = _(this.points);
                    a = points.sortedIndex({x:x}, 'x');
                    a = (a === 0) ? 0 : a-1;

                    b = points.sortedIndex({x:y}, 'x');
                    if (0 <= b && b < this.points.length) {
                        b = (this.points[b].x === y) ? b+2 : b+1;
                    }

                    return this.points.slice(a, b);
                }

            }, function () {

                this.points = [];

            });


        /**
         *  Lane objects contain all data
         *  needed to maintain and render
         *  lanes. They are observable via evt.
         */
        define('data.lane')
            .uses('util.evt')
            .as({

                /**
                 *  Returns the lanes width as absolute
                 *  value without dist as a factor.
                 *  This property can not be set manually
                 *  and is determined by the outermost right
                 *  point of the lanes ground.
                 */             
                width: function () {
                    return this.ground.max().x;
                },

                
                /**
                 *  Adds a point to the lane.
                 *
                 *  @param x Absolute x-coordinate
                 *  @type x Number
                 *  @param y Absolute y-coordinate
                 *  @type y Number
                 */
                addPoint: function (x, y) {
                    var p, i;

                    p = {x: x, y: y};
                    i = this.ground.add(p);

                    this.trigger('addPoint', p, i);
                },


                /**
                 *  Get points of the ground, where
                 *  the first point is the next point left
                 *  from position x and the last point the
                 *  next point right from position y.
                 *
                 *  The pixel value takes the dist property
                 *  of the lane in count.
                 *
                 *  @param x {optional} Left delimiter of the range
                 *  @type x Number
                 *  @param y {optional} Right delimiter of the range
                 *  @type y Number
                 */
                getPoints: function (x, y) {
                    return this.ground.get(x,y);
                },


                /**
                 *  Returns the two points left and right
                 *  from the provided x value. If no value
                 *  was found, undefined is returned.
                 */
                getPalingPoints: function (x) {
                    var points = this.ground.get(x,x);

                    if (this.width() <= x) {
                        return;
                    }

                    if (points.length === 3) {
                        points.shift();
                    }

                    if (points.length === 2) {
                        return points;
                    }
                },


                /**
                 *  Sets or gets the lanes base color.
                 *
                 *  @param color {optional} The lanes color.
                 *  @type color String
                 */
                color: function (color) {

                    if (color) {
                        if (!colorregex.test(color)) {
                            exc('Please provide a correct color value');
                        }
                        this._color = color;
                        this.trigger('changedColor');
                    }

                    return this._color;
                },


                /**
                 *  Describes rendering options.
                 *
                 */
                renderer: function (renderer) {
                    if (renderer) {
                        this._renderer = renderer;
                        this.trigger('rendererChanged', renderer);
                    }

                    return this._renderer;
                }

        /**
         *  constructor
         */
        }, function (dist) {

            if (!_(dist).isNumber()) {
                exc('You must provide a correct dist argument');
            }

            this.dist = dist;
            this.ground = ground.create();

        });


         
        /**
         *  Maintains lanes. Listens to the lanes
         *  events and delegates those for use by
         *  the lane broker or other interested parties.
         */
        define('data.lanes')
            .uses(
                'util.evt',
                'util.evt.proxy'
            ).as({

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
                    this.delegate(lane);
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

    }());
