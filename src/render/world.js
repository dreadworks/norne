
    /**
     *  Renders the environment using Context2D
     */
    define('render.world')
        .uses('util.evt')
        .as({

            // paints the current state of the world
            repaint: function () {
                var that, proxy;

                that = this;
                proxy = this.proxy;

                this.clearCanvas();

                _(proxy.lanes).each(function (lane) {
                    if (lane.dist <= proxy.character.dist) {
                        that.characterRenderer.render(proxy.character);
                    }

                    if (lane.renderer && lane.points && lane.points.length) {
                        lane.renderer.render(lane);
                    }

                    _(proxy.bodies.particles[lane.dist]).each(function (body) {
                        that.bodyRenderer.render(body);
                    });
                });
            },


            /**
             *  If no <wrapper> gets provided, returns
             *  the currently set canvas.
             *  
             *  Creates a canvas HTML-Element and sets
             *  this.wrapper and this.ctx. The width and height
             *  of the canvas element are determined by the
             *  width and height of the provided wrapper.
             *
             *  @param wrapper HTML-Element that will contain the canvas
             *  @type wrapper Element
             */
            canvas: function (wrapper) {
                var c = document.createElement('canvas');
                c.setAttribute('height', wrapper.offsetHeight);
                c.setAttribute('width', wrapper.offsetWidth);
                wrapper.appendChild(c);

                this.canv = c;
                this.ctx = this.canv.getContext('2d');
            },


            /**
             *  Returns the current width of the canvas.
             */
            canvasWidth: function () {
                return this.canv.offsetWidth;
            },

            /**
             *  Returns the current height of the canvas.
             */
            canvasHeight: function () {
                return this.canv.offsetHeight;
            },


            /**
             *  Clears the whole canvas context
             *  to enable clean repainting.
             */
            clearCanvas: function () {
                this.ctx.clearRect(
                    0, 0,
                    this.canv.width,
                    this.canv.height
                );
            }

        /**
         *  World renderer constructor.
         *
         *  @param proxy The object holding rendering information
         *  @type proxy Object
         *  @param clock The rendering timer
         *  @type util.clock
         *  @param wrapper where the environment gets rendered
         *  @type wrapper HTMLElement
         */
        }, function (proxy, clock, wrapper) {

            this.canvas(wrapper);

            this.characterRenderer = create(
                'render.character', this.canv
            );

            this.bodyRenderer = create(
                'render.body', this.canv
            );

            this.clock = clock;
            this.proxy = proxy;

            // everytime the clock ticks, a repaint is issued
            this.clock.on('tick', _(this.repaint).bind(this));
        });
