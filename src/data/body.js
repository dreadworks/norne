
    define('data.body')
        .uses('util.evt')
        .as({

            addForce: function (opts) {
                this.forces.push(opts);
                this.trigger('forceAdded', opts);
            },

            particles: function (opts) {
                if (opts === undefined) {
                    return this._particles;
                }

                this._particles = opts;
                this.trigger('particlesChanged', opts);
            },

            renderer: function (opts) {
                if (opts === undefined) {
                    return this._renderer;
                }

                this._renderer = opts;
                this.trigger('rendererChanged', opts);
            },

            color: function (color) {
                if (color === undefined) {
                    return this._color;
                }

                this._color = create('util.color', color);
                this.trigger('colorChanged', color);
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
