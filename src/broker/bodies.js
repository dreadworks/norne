

    define('broker.bodies.renderer')
        .as({

            render: function (bodies, meta) {
                console.log('broker.bodies.renderer', {x: bodies});

                var proxy = this.proxy;

                _(bodies).each(function (body, i) {

                    // lane
                    if (body.geometry.vertices && proxy.lane === undefined) {
                        proxy.lane = _(body.geometry.vertices).map(function (v) {
                            return {
                                x: v.get(0),
                                y: v.get(1)
                            };
                        });
                    }

                    // particles
                    if (body.geometry.radius) {
                        proxy.particles[i] = {
                            x: body.state.pos.get(0),
                            y: body.state.pos.get(1),
                            r: body.geometry.radius
                        };
                    }
                });

                this.parent.trigger('update');
            }

        }, function (proxy, parent) {
            this.proxy = proxy;
            this.parent = parent;

            this.proxy.particles = [];
        });


    define('broker.bodies')
        .uses('util.evt')
        .as({

            proxy: function (body) {
                var index, dist, proxy;

                dist = body.lane.dist;

                index = this._lanebroker.index(dist);
                proxy = this._proxy[index].bodies;
                proxy = proxy || (this._proxy[index].bodies = {});

                return proxy;
            },


            createEntry: function (body) {
                var index, physics, renderproxy, proxy;
                console.log('broker.bodies.createEntry', body);

                proxy = this.proxy(body);
                physics = create('physics.world').world;

                proxy[body.id] = {
                    physics: physics
                };

                proxy = proxy[body.id];
                renderproxy = create('broker.bodies.renderer', proxy, this);

                physics.add(create(
                    'physics.renderer', renderproxy, body
                ).renderer);


                physics.add(create(
                    'physics.body.lane.bezier', body.lane
                ).body);

                // TODO remove
                window.step = function () {
                    physics.step(Date.now());
                    physics.render();
                };
            },


            changeParticles: function (body, opts) {
                var proxy, particles;

                proxy = this.proxy(body);
                particles = [];

                _(opts.amount).times(function () {
                    particles.push(create(
                        'physics.body.particle.circle',
                        opts.x, opts.y, opts.r
                    ).body);
                });

                proxy[body.id].physics.add(particles);

            },


            changeRenderer: function (body, opts) {
                var proxy, module;

                proxy = this.proxy(body);
                module = 'render.body';

                opts = _(opts).map(function (val, key) {
                    return module +'.'+ key +'.'+ val;
                });

                module = create(module, this.world.renderer().canv);
                proxy[body.id].renderer = mixin(module, opts);
            }



        }, function (parent, bodies) {
            var that = this;

            // it uses the lane proxy, since
            // bodies are always bound to a lane
            // @see render.world.repaint
            this._proxy = parent.proxy.lanes;
            this._lanebroker = parent.broker.lanes;

            this.world = parent.world;

            bodies.on('bodyAdded', function (body) {
                that.createEntry(body);
            });

            bodies.on('particlesChanged', function (body, opts) {
                console.log('broker.bodies noted particlesChanged', opts);
                that.changeParticles(body, opts);
            });

            bodies.on('forceAdded', function (body, opts) {
                console.log('broker.bodies noted forceAdded', opts);
            });

            bodies.on('rendererChanged', function (body, opts) {
                console.log('broker.bodies noted rendererChanged', opts);
                that.changeRenderer(body, opts);
            });
        });
