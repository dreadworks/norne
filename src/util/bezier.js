




    /**
     *  Bezier curves
     */
    define('util.bezier')
        .uses('util.evt')
        .as({  

            abs: function (x) {
                if (x < 0) {
                    return -x;
                }
                return x;
            },    

            /**
             *  Returns the x,y coordinate to
             *  a given t-value.
             */
            getPoint: function (t) {
                var ctrlpts, ipoints = [], point, m;

                if (t === 0) {
                    point = _(ctrlpts).first();
                    return {
                        x: point.x,
                        y: point.y,
                        angle: 0
                    };  
                } else if (t === 1) {
                    point = _(ctrlpts).last();
                    return {
                        x: point.x,
                        y: point.y,
                        angle: 0
                    };  
                }

                ctrlpts = [
                    this.points[0],
                    this.ctrl1,
                    this.ctrl2,
                    this.points[1]
                ];

                while (ctrlpts.length > 1) {

                    for (var i = 0; i < ctrlpts.length - 1; i++) {
                        ipoints.push(
                            {
                                x: t * (ctrlpts[i+1].x - ctrlpts[i].x) + ctrlpts[i].x,
                                y: t * (ctrlpts[i+1].y - ctrlpts[i].y) + ctrlpts[i].y,
                            }
                        );
                    }

                    ctrlpts = ipoints;
                    ipoints = [];

                    if (ctrlpts.length === 2) {
                        m = (ctrlpts[1].y - ctrlpts[0].y) / (ctrlpts[1].x - ctrlpts[0].x);
                    }

                }

                point = _(ctrlpts).first();

                return {
                    x: point.x,
                    y: point.y,
                    angle: Math.atan(m)
                };
            },

            getY: function (xval) {
                var epsilon = 0.05, t, tmin, tmax,
                    value, derivative;

                t = (xval - _(this.points).first().x) / (_(this.points).last().x - _(this.points).first().x);
                
                tmin = 0;
                tmax = 1;

                for (var i = 0; i < 8; i++) {
                    value = this.getPoint(t).x;
                    derivative = (this.getPoint(t + epsilon).x - value) / epsilon;

                    if (this.abs(value - xval) < epsilon) {
                        return this.getPoint(t).y;
                    } else {
                        if (value < xval) {
                            tmin = t;
                        } else {
                            tmax = t;
                        }
                    }
                    t -= (value - xval) / derivative;
                }

                for (i = 0; Math.abs(value - xVal) > epsilon && i < 8; i++) {
                    if (value < xVal) {
                      tMin = t;
                      t = (t + tMax) / 2;
                    } else {
                      tMax = t;
                      t = (t + tMin) / 2;
                    }
                    value = this.getPoint(t).x;
                }
                return t;
            }        

        }, function (points) {

            var xmid;

            this.points = points;

            xmid = (this.points[0].x + this.points[1].x) / 2;

            this.ctrl1 = { x: xmid, y: points[0].y };
            this.ctrl2 = { x: xmid, y: points[1].y };

        });
    
