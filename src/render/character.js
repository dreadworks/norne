

    (function () {


        var exc;
        exc = _(norne.exc.raise).partial('render.character');

 
        /*
         * Character Renderer
         */
        norne.obj
            .define('render.character')
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
                    var sprite =
                        norne.obj.create('render.character.sprite', params);

                    this.spritesheet.addAnimation(name, sprite);
                }, 

                /**
                 * Sets the active animation.
                 *
                 *  @param name Name of the animation
                 */
                setAnimation: function (name) {
                    this.sprite =
                        this.spritesheet.animations[name];

                    if (!this.sprite) {
                        exc('Not existing Animation given: ' + name);
                    }
                },

                render: function () {
                    if (this.imgLoaded) {
                        this.paintCharacter();
                    }
                },

                paintCharacter: function () {
                    var frame;

                    frame = this.animation.frame();

                    this.ctx.drawImage(
                            this.image,
                            frame.x, frame.y,
                            frame.width, frame.height,
                            100, 100,
                            100, 100
                        );
                }

            }, function (canvas, opts) {

                var spritesheet, sprite, image,
                    imgLoaded = false;

                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');

                //this.spritesheet =
                //    norne.obj.create('render.character.spritesheet', opts.image);
                this.spritesheet =
                    norne.obj.create('render.character.spritesheet', 'sprite_sheet.png');


                this.image = new Image();
                this.image.src = this.spritesheet.image;
                this.image.onload = function () {
                    this.imgLoaded = true;
                };

            });



        /*
         * A Single Frame Object
         */
        norne.obj
            .define('render.character.sprite.frame')
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
         * Single Sprite Animation
         */
        norne.obj
            .define('render.character.sprite')
            .as({

                frame: function () {
                    return this.frames[this.index];
                },

                //
                // Push to the next frame
                step: function () {
                    this.index = (this.index+1) % this.frames.length;
                },

                //
                // reset animation
                reset: function () {
                    this.index = 0;
                }

            }, function (opts) {
                var defaults, range, optsparams, that;

                this.index = 0;
                this.frames = [];

                defaults = [
                    'fwidth',   // frame width
                    'fheight',  // frame height
                    'startx',   // x-Position of first frame
                    'starty',   // y-Position of first frame
                    'columns',  // frames per row
                    'rows'      // num of rows
                ];

                /*
                 * Test for the needed properties
                 */
                optsparams = Object.getOwnPropertyNames(opts);
                optsparams = _(defaults).difference(optsparams);
                if (optsparams.length > 0) {
                    norne.exc.raise(
                        "core.character",
                        "Missing opts parameters " + optsparams
                    );
                }
      
                that = this;
                _(this).extend(opts);

                range = _.range(that.columns*that.rows);
                _(range).each(function (i) {
                    that.frames.push(
                        norne.obj.create('render.character.sprite.frame', {
                            x: that.startx + (i % that.columns) * that.fwidth, 
                            y: that.starty + (parseInt(i/that.columns)) * that.fheight,
                            width: that.fwidth,
                            height: that.fheight
                        })
                    );
                });

            });


        /*
         * Collection of Sprite-Animations
         * Needs an image in 'opts' in order to work
         */
        norne.obj
            .define('render.character.spritesheet')
            .as({

                animations: {},

                addAnimation: function (name, sprite) {
                    this.animations[name] = sprite;
                }

            }, function (image) {

                this.image = image;

            });


    }());


