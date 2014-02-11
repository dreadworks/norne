
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
             *  Fill the drawn lane.
             *
             *  @param points An array of canvas coordinates.
             *  @type points Array
             *  @param color The color as saved in the proxy.
             *  @type color Object
             */
            fill: function (points, color) {
                this.raise('You must overwrite render.lane.fill');
            },


            /**
             *  Set the lanes color.
             *
             *  @param proxy The lanes proxy part.
             *  @type proxy Object
             *  @param color The lanes color.
             *  @type color util.color
             */
            setColor: function (proxy, color) {
                this.raise('You must overwrite render.lane.setColor');
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
            },


            /**
             *  @see render.lane.setColor
             */
            setColor: function (proxy, color) {
                proxy.color = color.toString();
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
                this.ctx.strokeStyle = color.stroke;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            },


            /**
             *  @see render.lane.setColor
             */
            setColor: function (proxy, color) {
                proxy.color = {
                    light: color.toString(),
                    dark: color.clone().darken(10).toString(),
                    stroke: color.clone().darken(10).toString()
                };
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
                lingrand.addColorStop(0, color.dark);
                lingrand.addColorStop(1, color.light);

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


