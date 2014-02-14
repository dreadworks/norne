

    define('data.body')
        .uses('util.evt')
        .as({

            addForce: function (opts) {
                this.forces.push(opts);
                this.trigger('forceAdded', opts);
            },

            particles: function (n) {
                if (n === undefined) {
                    return this._particles;
                }

                this._particles = n;
                this.trigger('particlesChanged', n);
            }

        }, (function (lane) {
            var id = 0;

            return function (lane) {
                this.id = id++;
                
                this.lane = lane;
                this.forces = [];
            };
        }()));
    

    define('data.bodies')
        .uses(
           'util.evt',
           'util.evt.proxy'
        ).as({

            add: function (body) {
                var bodies;

                bodies = this[body.lane] || (this[body.lane] = []);
                bodies.push(body);

                this.delegate(body);
                this.trigger('bodyAdded', body);
            }

        });
