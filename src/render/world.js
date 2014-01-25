


    (function () {

        var exc;
        exc = _(norne.exc.raise).partial('render.world');


        /**
         *  Renders the environment using Context2D
         */
        define('render.world')
            .uses('util.evt')
            .as({

                // paints the current state of the world
                repaint: function () {
                    var that, character;

                    that = this;
                    this.clearCanvas();

                    // repaint the lanes
                    _(this.proxy.lanes).each(function (lane) {
                        if (lane.points && lane.points.length) {
                            that.laneRenderer.renderLane(lane);
                        }
                    });
                },


                /**
                 *  If no <wrapper> gets provided, returns
                 *  the currently set canvas.
                 *  
                 *  Creates a canvas HTML-Element and sets
                 *  this.canvas and this.ctx. The width and height
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

                    this.canvas = c;
                    this.ctx = this.canvas.getContext('2d');
                },


                canvasWidth: function () {
                    return this.canvas.offsetWidth;
                },


                // clears the whole canvas to paint
                // the new state
                clearCanvas: function () {
                    this.ctx.clearRect(
                        0, 0,
                        this.canvas.width,
                        this.canvas.height
                    );
                }

            /**
             *
             *  @param canvas where the environment gets rendered
             *  @type canvas HTMLElement
             */
            }, function (proxy, clock, wrapper) {

                this.canvas(wrapper);
                this.laneRenderer = create(
                    'render.lane', this.canvas
                );

                this.clock = clock;
                this.proxy = proxy;

                // everytime the clock ticks, a repaint is issued
                this.clock.on('tick', _(this.repaint).bind(this));
            });

    }());


