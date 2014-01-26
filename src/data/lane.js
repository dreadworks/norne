
    (function () {


        var exc, colorregex, pointfac, groundfac;

        exc = _(norne.exc.raise).partial('data.lane');
        colorregex = /[0-9a-f]{6}/i;
        

        // OBJECTS
        /**
         *  Point objects describe the height
         *  of the ground (y) at an arbitrary
         *  horizontal position (x).
         */
        pointfac = define('data.lane.point')
            .as({}, function (x, y) {
                this.x = x;
                this.y = y;
            });


        /**
         *  Data structure to handle a list
         *  of points that describe the ground surface.
         *
         *  Encapsulates an array, that stays sorted by
         *  its property x (the horizontal position).
         */
        groundfac = define('data.lane.ground')
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
                    var i, a;

                    if (!_(x).isNumber()) {
                        return this.points;
                    }

                    a = [];
                    i = _(this.points).sortedIndex({x:x}, 'x');
                    i = (i === 0) ? 0 : i-1;

                    do {
                        a.push(this.points[i++]);
                    } while (i < this.points.length && this.points[i].x <= y);

                    if (this.points[i]) {
                        a.push(this.points[i]);
                    }

                    return a;
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

                    p = pointfac.create(x, y);
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
                 *  Sets or gets the lanes base color.
                 *
                 *  @param color {optional} The lanes color.
                 *  @type color String
                 */
                color: function (color) {

                    // TODO an event must be thrown for the broker.

                    if (color) {
                        if (!colorregex.test(color)) {
                            exc('Please provide a correct color value');
                        }
                        this._color = color;
                        this.trigger('changedColor');
                    }

                    return this._color;
                }

        /**
         *  constructor
         */
        }, function (dist) {

            if (!_(dist).isNumber()) {
                exc('You must provide a correct dist argument');
            }

            this.dist = dist;
            this.ground = groundfac.create();

        });


         
        /**
         *  Maintains lanes. Listens to the lanes
         *  events and delegates those for use by
         *  the lane broker or other interested parties.
         */
        define('data.lanes')
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

                    lane.on('addPoint', function (point, index) {
                        that.trigger('addPoint', lane, point, index);
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

    }());
