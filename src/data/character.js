

    (function () {


        var exc;
        exc = _(norne.exc.raise).partial('data.character');



        // EVENTS


        /**
         *  Events gets triggered whenever a new
         *  animation is available.
         */
        define('evt.character.addAnimation')
            .as(function (name) {
                this.name = name;
            });

        /**
         *  Events gets triggered whenever the
         *  character changed its active animation.
         */
        define('evt.character.changedAnimation')
            .as(function () {
                
            });

        define('evt.character.changedPos')
            .as(function (x, y) {
                this.x = x;
                this.y = y;
            });



        /*
         * Character
         */
        define('data.character')
            .uses('util.evt')
            .as({

                /**
                 *  Adds an animation to this character.
                 *  An animation is determined by its position
                 *  on a sprite, therefore following params are needed:
                 *      - fwidth: width of a single frame
                 *      - fheight: height of a single frame
                 *      - startx: the starting x-position of the first frame
                 *      - starty: the starting y-position of the first frame
                 *      - columns: num of columns
                 *      _ framecount: total amount of frames
                 *
                 *  @param name Animation name
                 *  @type name String
                 *  @param params Dictionary containing the
                 *  relevant information for an animation
                 */
                addAnimation: function (name, params) {
                    var sprite = create(
                            'data.character.sprite',
                            params
                        );
                    this.spritesheet.addAnimation(name, sprite);

                    this.trigger('addAnimation', name);

                    this.setAnimation(name);
                },

                /**
                 *  Sets the active animation.
                 */
                setAnimation: function (name) {
                    if (this.animation) {
                        this.animation.stop();
                    }

                    this.animation =
                        this.spritesheet.animations[name];
                    this.animation.startAnimation();

                    this.trigger('changedAnimation');

                    var that = this;

                    // badass workaround
                    this.animation.on('changedAnimation', function () {
                        that.trigger('changedAnimation');
                    });
                },

                /**
                 * Returns the active animation
                 */
                getAnimation: function () {
                    return this.animation;
                },

                currentFrame: function () {
                    if (this.animation) {
                        return this.animation.getFrame();
                    }
                },

                setPos: function (x, y, angle) {
                    var dx = this.x;

                    this.x = x || this.x;
                    this.y = y || this.y;
                    this.angle = angle || this.angle;

                    this.trigger('changedPos', this.x, this.y, dx);
                },

                move: function () {
                    var x = this.x, pt, points, dx, ang;

                    ang = this.angle * this.direction;
                    dx = (5 - (2 * ang)) * this.direction;
                    x = x + dx;

                    if (this.bezier === undefined || !this.bezier.inRangeX(x)) {
                        points = this.lane.getPalingPoints(x);
                        if (points === undefined) {
                            return;
                        }
                        this.bezier = create('util.bezier', points);
                    }

                    pt = this.bezier.getY(x);

                    this.setPos(pt.x, pt.y, pt.angle);
                },


                /**
                 *  Add a movement. The provided function gets
                 *  called with an object where 'start' and
                 *  'stop' events can be triggered.
                 *
                 *  @param fn Function that triggers events.
                 *  @type fn Function
                 */
                addMovement: function (fn) {
                    fn(this._mvclock);
                }

            }, function (opts) {

                var x, y, width, height, sprite,
                    animation, mvclock, that = this;

                if (!opts.sprite) {
                    exc('No Image provided');
                }

                this.spritesheet = create(
                        'data.character.spritesheet',
                        opts.sprite
                    );

                this.width = opts.width || 100;
                this.height = opts.height || 100;

                this.x = opts.x || 0;
                this.y = 0;
                this.angle = 0;
                this.direction = 1;

                this.image = opts.sprite;

                //
                // MOVEMENT
                //
                // TODO determine value range
                this.acceleration = opts.acceleration || 1;
                this._mvclock = mvclock = create('util.clock', 
                    opts.velocity || 33,
                    false
                );

                mvclock.on('start', function (direction, anim) {
                    that.direction = direction === '+' ? 1 : -1;
                    that.setAnimation(anim);
                });

                mvclock.on('stop', function (anim) {
                    that.setAnimation(anim);
                });

                mvclock.on('tick', function () {
                    that.move.call(that);
                });
            });



        /*
         *  A single frame inside an animation. Holds
         *  the clipping coordinates.
         */
        define('data.character.sprite.frame')
            .as({

            }, function (opts) {

                var defaults = {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                };

                _(this).extend(defaults, opts);

            });



        /*
         *  A sprite represents a single animation, eg.
         *  'Walking Left' or 'Standing'. Therefore it
         *  holds the clipping coordinates for the frames
         *  defining an animation.
         */
        define('data.character.sprite')
            .uses('util.evt')
            .as({

                /**
                 *  Returns active frame
                 */
                getFrame: function () {
                    return this.frames[this.index];
                },

                /**
                 *  Push to the next animation-frame
                 */
                step: function () {
                    this.index = (this.index+1) % this.frames.length;
                    this.trigger('changedAnimation');
                },

                /**
                 *  Reset Animation
                 */
                reset: function () {
                    this.index = 0;
                },

                stop: function () {
                    clearInterval(this.intervalId);
                    this.reset();
                },

                startAnimation: function () {
                    this.intervalId = setInterval(
                        (function (self) {
                            return function () {
                                self.step();
                            };
                        })(this),
                        this.tick
                    );
                }

            }, function (opts) {

                var defaults, range, that;

                this.index = 0;
                this.frames = [];
                this.tick = opts.tick;
      
                that = this;
                _(this).extend(opts);

                range = _.range(that.framecount);
                _(range).each(function (i) {
                    that.frames.push(
                        create('data.character.sprite.frame', {
                            x: that.start.x + (i % that.columns) * that.frame.width, 
                            y: that.start.y + (parseInt(i/that.columns)) * that.frame.height,
                            width: that.frame.width,
                            height: that.frame.height
                        })
                    );
                });

            });


        /*
         *  Collection of Sprite-Animations. A spritesheet
         *  is basically an image with several animation patterns
         *  (here 'sprites').
         */
        define('data.character.spritesheet')
            .as({

                animations: {},

                addAnimation: function (name, sprite) {
                    this.animations[name] = sprite;
                }

            }, function (image) {

                this.image = image;

            });




    })();