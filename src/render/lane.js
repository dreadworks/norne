
    /*
     * Renderer for lanes
     */
    define('render.lane')
        .as({

            /**
             *  Calls all necessary methods to
             *  render a lane.
             *
             *  @param lane Lane as saved in the proxy
             *  @type lane Object
             */
            render: function (lane) {
                var color = lane.color,
                    points = lane.points;

                this.draw(points);
                this.fill(points, color);                
            },


            /**
             *  Draw the ground of the lane. The provided
             *  values already have the correct canvas
             *  coordinates.
             *
             *  @param points An array of points to display.
             *  @type points Array
             */
             draw: function (points) {
                this.raise('You must overwrite render.lane.draw');
             },


             /**
              * Fill the drawn lane.
              *
              * @param points An array of canvas coordinates.
              * @type points Array
              * @param color The color as a hex-code string.
              * @type color String
              */
             fill: function (points, color) {
                this.raise('You must overwrite render.lane.fill');
             }

        }, function (canvas) {

            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');

        });


    /**
     *  Paints the ground with a solid color.
     */
    define('render.lane.color.solid')
        .as({

            /**
             *  @see render.lane.fill
             */
            fill: function (points, color) {
                this.ctx.fillStyle = color;
                this.ctx.fill();
            }

        });


    /**
     *  Paints the ground with a gradient.
     */
    define('render.lane.color.gradient')
        .as({

            /**
             *  @see render.lane.fill
             */
            fill: function (points, color) {
                var lingrand;

                // fill
                lingrand = this.linearGradient(points, color);
                this.ctx.fillStyle = lingrand;
                this.ctx.fill();

                // stroke
                this.ctx.strokeStyle = this.shadeColor(color, -60);
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            },
            

            /* 
             * shades a color given by percentage
             * shadeColor(..., -40) will darken the color
             * by 40%
             *
             * TODO #8
             */
            shadeColor: function (color, perc) {
                var r, g, b, num;

                num = parseInt(color, 16);

                r = parseInt((num >> 16) * (100 + perc) / 100);
                g = parseInt(((num >> 8) & 0x00FF) * (100 + perc) / 100);
                b = parseInt((num & 0x0000FF) * (100 + perc) / 100);

                if (r > 255) { r = 255; }
                else if (r < 0) { r = 0; }

                if (g > 255) { g = 255; }
                else if (g < 0) { g = 0; }

                if (b > 255) { b = 255; }
                else if (b < 0) { b = 0; }

                r = r.toString(16).length === 1 ? '0' + r.toString(16) : r.toString(16);
                g = g.toString(16).length === 1 ? '0' + g.toString(16) : g.toString(16);
                b = b.toString(16).length === 1 ? '0' + b.toString(16) : b.toString(16);

                return r + g + b;
            },
            

            /* 
             *  Creates a LinearGradient out of the given
             *  points. Needed to get the y-position of
             *  the highest and lowest point.
             *
             *  TODO #9
             */
            linearGradient: function (points, color) {
                var x1=0, y1, x2=0,
                    y2=this.canvas.height+10,
                    lingrand;

                y1 = _.min(points, function (point) {
                    return point.y;
                });

                y1 = y1.y;

                lingrand = this.ctx.createLinearGradient(x1, y1, x2, y2);
                lingrand.addColorStop(0, this.shadeColor(color, -70));
                lingrand.addColorStop(1, color);

                return lingrand;
            }

        });




    /**
     *  Renders the lanes ground
     *  as a simple path from point
     *  to point.
     */
     define('render.lane.ground.simple')
         .as({

            /**
             *  @see render.lane.draw
             */
             draw: function (points) {
                var that = this;

                this.ctx.beginPath();
                this.ctx.moveTo(points[0].x, points[0].y);

                _(points).each(function (p) {
                    that.ctx.lineTo(p.x, p.y);
                });

                this.ctx.lineTo(_(points).last().x, this.canvas.height+10);
                this.ctx.lineTo(_(points).first().x, this.canvas.height+10);

                this.ctx.closePath();
             }

         });


    /** 
     *  Renders the lanes ground
     *  roundly by interpolating
     *  splines from the ground points.
     */
    define('render.lane.ground.bezier')
        .as({


            /**
             *  @see render.lane.draw
             */
            draw: function (points) {
                var i = 1, xc, yc;

                if (!points) {
                    return;
                }
                
                this.ctx.beginPath();
                this.ctx.moveTo(points[0].x, points[0].y);

                for (i = 0; i < points.length - 1; i++) {

                    var xmid = (points[i+1].x + points[i].x) / 2;

                    this.ctx.bezierCurveTo(
                        xmid,
                        points[i].y,

                        xmid,
                        points[i+1].y,

                        points[i+1].x,
                        points[i+1].y
                    );
                }

                this.ctx.lineTo(points[i].x, this.canvas.height+10);
                this.ctx.lineTo(points[0].x, this.canvas.height+10);
                this.ctx.closePath();
            }

        });


