

    define('broker.bodies.renderer')
        .as({

            updateLaneProxy: function (i, x, y, geometry, dist) {
                var that = this;

                this.proxy.lanes[i] = _(geometry.vertices).map(function (v) {
                    return that.world.map(that.proxy.dist, {
                        x: -that.world.pos() + v.get(0) + x,
                        y: v.get(1) + y
                    });
                });

            },


            updateParticleProxy: function (i, x, y, geometry, dist) {

                this.proxy.particles[i] = this.world.map(this.proxy.dist, {
                    x: -this.world.pos() + x, y: y,
                    r: geometry.radius
                });

            },


            updateProxy: function () {
                var that = this;

                _(this.bodies).each(function (body, i) {
                    var geometry, x, y, bb, hh, hw, bbpos, pos;

                    geometry = body.geometry;
                    bb = geometry.aabb();

                    hw = bb.halfWidth;
                    hh = bb.halfHeight;
                    bbpos = bb.pos;
                    
                    pos = body.state.pos;

                    // mhh, pos.get(x) worked better after all...
                    //x = Math.abs(bb.pos.x) + pos.get(0) - hw/2;
                    //y = Math.abs(bb.pos.y) + pos.get(1) - hh/2;

                    x = pos.get(0);
                    y = pos.get(1);

                    if (geometry.name === 'convex-polygon') {
                        that.updateLaneProxy(i, x, y, geometry);
                    }

                    if (geometry.name === 'circle') {
                        that.updateParticleProxy(i, x, y, geometry);
                    }
                });

                this.parent.trigger('update');
            },


            render: function (bodies, meta) {
                //console.log('broker.bodies.renderer', {x: bodies});

                var proxy, that;
                that = this;

                this._world.publish({
                    topic: 'beforeRender',
                    renderer: this,
                    bodies: bodies,
                    meta: meta
                });

                this.bodies = bodies;
                this.updateProxy();
            }

        }, function (proxy, parent) {
            this.proxy = proxy;
            this.parent = parent;
            this.world = parent.world;

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

            remapProxy: function () {
                _(this._proxy).each(function (lane) {
                    if (lane.bodies) {
                        _(lane.bodies).each(function (body) {
                            body.renderproxy.updateProxy();
                        });
                    }
                });
            },

            createEntry: function (body) {
                var index, physics, renderproxy, proxy;
                console.log('broker.bodies.createEntry', body);

                proxy = this.proxy(body);
                physics = create('physics.world').world;

                proxy[body.id] = {
                    physics: physics,
                    lanes: [],
                    dist: body.lane.dist
                };

                proxy = proxy[body.id];
                renderproxy = create('broker.bodies.renderer', proxy, this);

                proxy.renderproxy = renderproxy;
                proxy.rendercontext = create(
                    'physics.renderer', renderproxy, body
                ).renderer;

                physics.add(proxy.rendercontext);
                proxy.renderproxy.updateProxy = _(proxy.renderproxy.updateProxy)
                    .bind(proxy.rendercontext);

                physics.add(create(
                    'physics.body.lane.simple', body.lane, this.world
                ).bodies);

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

                _(opts.amount).times(function (i) {
                    particles.push(create(
                        'physics.body.particle.circle',
                        opts.x + i*4, 
                        opts.y - (i%10)*2,
                        opts.r
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
            },


            changeColor: function (body, color) {
                this.proxy(body)[body.id].color = color.toString();
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
                that.changeParticles(body, opts);
            });

            bodies.on('forceAdded', function (body, opts) {
                console.log('broker.bodies noted forceAdded', opts);
            });

            bodies.on('rendererChanged', function (body, opts) {
                that.changeRenderer(body, opts);
            });

            bodies.on('colorChanged', function (body, color) {
                that.changeColor(body, color);
            });


            parent.world.on('posChanged', function (pos) {
                that.remapProxy();
            });
        });
