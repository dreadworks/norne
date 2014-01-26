

    (function () {


        /*
         * Renderer for lanes
         */
        define('render.lane')
            .as({

                // renders a single lane
                renderLane: function (lane) {
                    var color = lane.color,
                        points = lane.points;

                    this.paintLane(points, color);
                    this.fillLane(points, color);
                    this.fillStroke(color);
                },

                // paints the path for a lane
                paintLane: function (points, color) {
                    var i = 1, xc, yc;

                    if (!points) {
                        return;
                    }
                    /*
                    while (points.length < 3) {
                        points.push(_(points).last());
                    }*/

                    for (i = 1; i < points.length - 1; i++) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(points[i].x, points[i].y);

                        var xmid = (points[i+1].x - points[i].x) / 2;

                        this.ctx.bezierCurveTo(
                            xmid,
                            points[i].y,

                            xmid,
                            points[i+1].y,

                            points[i+1].x,
                            points[i+1].y
                        );
                    }


                    /*
                    this.ctx.beginPath();
                    this.ctx.moveTo(points[0].x, points[0].y);

                    for (i = 1; i < points.length - 2; i++) {
                        xc = (points[i].x + points[i + 1].x) / 2;
                        yc = (points[i].y + points[i + 1].y) / 2;
                        this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
                    }

                    this.ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);
                    */
                    this.ctx.lineTo(points[i].x, this.canvas.height+10);
                    this.ctx.lineTo(points[0].x, this.canvas.height+10);
                    this.ctx.closePath();
                },

                // paints the lane body with
                // a linear gradient. the top of the
                // body will have a darkened version
                // of the given color
                fillLane: function (points, color) {
                    var lingrand = this.linearGradient(points, color);
                    this.ctx.fillStyle = lingrand;
                    this.ctx.fill();
                },

                // fills the top stroke of a lane
                // with a much darkened version of
                // the given color
                fillStroke: function (color) {
                    this.ctx.strokeStyle = this.shadeColor(color, -50);
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                },

                // shades a color given by percentage
                // shadeColor(..., -40) will darken the color
                // by 40%
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

                // Creates a LinearGradient out of the given
                // points. Needed to get the y-position of
                // the highest and lowest point
                linearGradient: function (points, color) {
                    var x1=0, y1, x2=0,
                        y2=this.canvas.height+10,
                        lingrand;

                    y1 = _.min(points, function (point) {
                        return point.y;
                    });

                    y1 = y1.y;

                    lingrand = this.ctx.createLinearGradient(x1, y1, x2, y2);
                    lingrand.addColorStop(0, this.shadeColor(color, -40));
                    lingrand.addColorStop(1, color);

                    return lingrand;
                }

            }, function (canvas) {

                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');

            });



    }());


