

    (function () {


        var exc;
        exc = _(norne.exc.raise).partial('render.canvas.character');

 
        /*
         * Character Renderer
         */
        norne.obj
            .define('render.canvas.character')
            .as({

                render: function (proxy) {
                    if (this.imgLoaded) {
                        this.paintCharacter(proxy);
                        return;
                    }

                    if (proxy.image) {
                        this.setImageSource(proxy.image);
                    }
                },

                paintCharacter: function (proxy) {
                    var frame = proxy.frame;

                    if (!frame) {
                        return;
                    }

                    this.ctx.drawImage(
                            this.image,
                            frame.x, frame.y,
                            frame.width, frame.height,
                            proxy.x - (proxy.width / 2), proxy.y,
                            frame.width * proxy.width, frame.height * proxy.height
                        );
                },

                setImageSource: function (image) {
                    var that = this;

                    this.image = new Image();
                    this.image.src = image;
                    
                    this.image.onload = function () {
                        that.imgLoaded = true;
                    };
                } 

            }, function (canvas) {

                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');

                this.imgLoaded = false;
            });





    }());


