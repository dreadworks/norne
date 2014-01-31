

    define('data.body')
        .uses('util.evt')
        .as({

            _addParticle: function () {

            },

            _removeParticle: function () {

            },

            particles: function (n) {
                console.log('data.body.particles', n);

                if (_(n).isNumber()) {
                    while (n > this._particles) {
                        this.removeParticle();
                    }

                    while (this._particles > n) {
                        this.addParticle();
                    }

                    this.trigger('particlesChanged', n);
                }

                return this._particles;
            },

            color: function (h, s, l) {
                if (_(arguments).every(_.isNumber)) {
                    this._color = 'hsl('+ h +', '+ s +'%, '+ l +'%)';
                    this.trigger('colorChanged', this._color);
                }

                return this._color;
            },


            lane: function (lane) {
                lane.getPoints();
            }

        }, function (physics, clock, opts) {

            var defaults = {
                particles: 100,
                color: { h: 0, s: 0, l: 0 }
            };

            opts = _(defaults).extend(opts);

            this.particles(opts.particles);
            this.color(opts.color.h, opts.color.s, opts.color.l);

            this.physics = physics;
            this.clock = clock;

            // TODO #4
            this.clock.on('tick', function () {
                physics.step(Date.now());
                physics.render();
            });
        });


    define('data.bodies')
        .as({

            add: function (body) {
                var that;
                this.bodies.push(body);

                that = this;
                this.on('particlesChanged', function (n) {
                    that.trigger('particlesChanged', body, n);
                });
            }

        }, function () {

            this.bodies = [];

        });