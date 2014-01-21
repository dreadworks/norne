

    (function () {


        var exc;
        exc = _(norne.exc.raise).partial('render.character');

 
        /*
         * Character Renderer
         */
        norne.obj
            .define('render.character')
            .as({

                render: function () {
                    if (this.imgLoaded) {
                        this.paintCharacter();
                    }
                },

                paintCharacter: function () {
                    var frame = this.animation.frame();

                    this.ctx.drawImage(
                            this.image,
                            frame.x, frame.y,
                            frame.width, frame.height,
                            100, 100,
                            100, 100
                        );
                }

            }, function (canvas, opts) {

                var image, imgLoaded = false;

                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');

                this.image = new Image();
                this.image.src = this.spritesheet.image;
                this.image.onload = function () {
                    this.imgLoaded = true;
                };

            });





    }());


