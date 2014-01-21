

    (function () {


        var exc;
        exc = _(norne.exc.raise).partial('data.character');


        /*
         * Character
         */
        norne.obj
            .define('data.character')
            .as({

                addAnimation: function (name, params) {
                    this.animations.push(name);

                }

            }, function (opts) {

                var x, y, width, height, sprite,
                    animations;

                if (!opts.sprite) {
                    exc('No Image provided');
                }

                this.animations = [];

                this.width = opts.width || 100;
                this.height = opts.height || 100;

            });



    })();