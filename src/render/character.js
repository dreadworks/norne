

    (function () {


        var exc;
        exc = _(norne.exc.raise).partial('render.canvas.character');

 
        /*
         * Character Renderer
         */
        define('render.character')
            .as({

                render: function (proxy) {
                    if (this.imgLoaded) {
                        this.paintCharacter(proxy);
                        return;
                    }

                    if (!this.imageLoaded && proxy.image) {
                        this.setImageSource(proxy.image);
                    }
                },

                paintCharacter: function (proxy) {
                    var frame = proxy.frame;

                    if (!frame) {
                        return;
                    }
                    
                    this.ctx.drawImage(
                            this.image, // image to draw
                            frame.x,    // clipping x-coord
                            frame.y,    // clipping y-coord

                            frame.width,    // width of the clipped frame
                            frame.height,   // height of the clipped frame
                            
                            proxy.x - (proxy.width / 2),       // x-position on canvas
                            proxy.y - proxy.height,    // y-position on canvas
                            
                            proxy.width,    // width of shown image
                            proxy.height    // height of shown image
                        );

                    this.ctx.beginPath();
                    this.ctx.arc(proxy.x, proxy.y, 5, 0, 2*Math.PI);
                    this.ctx.fillStyle='Blue';
                    this.ctx.fill();
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


