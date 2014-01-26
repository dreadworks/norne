
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
                var ctrlpoints, ipoints = [];

                if (t === 0) {
                    return _(this.points).first();
                } else if (t === 1) {
                    return _(this.points).last();
                }

                ctrlpoints = this.points;

                while (ctrlpoints.length > 1) {

                    for (var i = 0; i < ctrlpoints.length - 1; i++) {
                        ipoints.push(
                            {
                                x: t * (ctrlpoints[i+1].x - ctrlpoints[i].x) + ctrlpoints[i].x,
                                y: t * (ctrlpoints[i+1].y - ctrlpoints[i].y) + ctrlpoints[i].y,
                            }
                        );
                    }

                    ctrlpoints = ipoints;
                    ipoints = [];

                }

                return _(ctrlpoints).first();
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

            this.points = points;

        });



