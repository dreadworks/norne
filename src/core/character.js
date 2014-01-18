

    /*
     * A Single Frame Object
     */
    norne.obj
        .define('core.character.sprite.frame')
        .as({

        }, function (opts) {

            var defaults = {
                x: 0,
                y: 0
            };

            _(this).extend(defaults, opts);


        });



    /*
     * Single Sprite Animation
     */
    norne.obj
        .define('core.character.sprite')
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
                    norne.obj.create('core.character.sprite.frame', {
                        x: that.startx + (i % that.columns) * that.fwidth, 
                        y: that.starty + (parseInt(i/that.columns)) * that.fheight
                    })
                );
            });

        });


    /*
     * Collection of Sprite-Animations
     * Needs an image in 'opts' in order to work
     */
    norne.obj
        .define('core.character.spritesheet')
        .as({

            animations: {},

            addAnimation: function (name, sprite) {
                this.animations[name] = sprite;
            }

        }, function (opts) {


            _(this).extend(opts);

        });


    /*
     * Character
     */
    norne.obj
        .define('core.character')
        .as({

            spritesheet: norne.obj.create('core.character.spritesheet'),

            x: 0,
            y: 0

        }, function (opts) {

        });





