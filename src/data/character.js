

    (function () {


        var exc;
        exc = _(norne.exc.raise).partial('data.character');


        /*
         * Character
         */
        norne.obj
            .define('data.character')
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
                    var sprite = norne.obj.create(
                            'data.character.sprite',
                            params
                        );
                    this.spritesheet.addAnimation(name, sprite);

                    // ##!!##!!##!!##!!
                    this.setAnimation(name);
                },

                /**
                 *  Sets the active animation.
                 */
                setAnimation: function (name) {
                    this.animation =
                        this.spritesheet.animations[name];

                    this.trigger('changedAnimation');
                },

                /**
                 * Returns the active animation
                 */
                getAnimation: function () {
                    return this.animation;
                }

            }, function (opts) {

                var x, y, width, height, sprite,
                    animation;

                if (!opts.sprite) {
                    exc('No Image provided');
                }

                this.spritesheet = norne.obj.create(
                        'data.character.spritesheet',
                        opts.sprite
                    );

                this.width = opts.width || 100;
                this.height = opts.height || 100;

            });



        /*
         *  A single frame inside an animation. Holds
         *  the clipping coordinates.
         */
        norne.obj
            .define('data.character.sprite.frame')
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
        norne.obj
            .define('data.character.sprite')
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
                },

                /**
                 *  Reset Animation
                 */
                reset: function () {
                    this.index = 0;
                }

            }, function (opts) {

                var defaults, range, that;

                this.index = 0;
                this.frames = [];
      
                that = this;
                _(this).extend(opts);

                range = _.range(that.framecount);
                _(range).each(function (i) {
                    that.frames.push(
                        norne.obj.create('data.character.sprite.frame', {
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
        norne.obj
            .define('data.character.spritesheet')
            .as({

                animations: {},

                addAnimation: function (name, sprite) {
                    this.animations[name] = sprite;
                }

            }, function (image) {

                this.image = image;

            });




    })();