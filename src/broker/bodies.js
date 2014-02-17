

    define('broker.bodies.renderer')
        .as({

            updateLaneProxy: function (body, i, x, y, geometry) {

                this.proxy.lanes[i] = _(geometry.vertices).map(function (v) {
                    return {
                        x: v.get(0) + x,
                        y: v.get(1) + y
                    };
                });

            },


            updateParticleProxy: function (body, i, x, y, geometry) {

                this.proxy.particles[i] = {
                    x: x, y: y,
                    r: geometry.radius
                };

            },


            render: function (bodies, meta) {
                //console.log('broker.bodies.renderer', {x: bodies});

                var proxy, that;

                that = this;
                proxy = this.proxy;

                this._world.publish({
                    topic: 'beforeRender',
                    renderer: this,
                    bodies: bodies,
                    meta: meta
                });
                
                _(bodies).each(function (body, i) {
                    var geometry, x, y, bb, hh, hw, bbpos, pos;

                    geometry = body.geometry;
                    bb = geometry.aabb();

                    hw = bb.halfWidth;
                    hh = bb.halfHeight;
                    bbpos = bb.pos;
                    
                    pos = body.state.pos;

                    // hw/4, hh/4 ??
                    //x = Math.abs(bb.pos.x) + pos.get(0) - hw/2;
                    //y = Math.abs(bb.pos.y) + pos.get(1) - hh/2;

                    x = pos.get(0);
                    y = pos.get(1);

                    if (geometry.name === 'convex-polygon') {
                        that.updateLaneProxy(body, i, x, y, geometry);
                    }

                    if (geometry.name === 'circle') {
                        that.updateParticleProxy(body, i, x, y, geometry);
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
                    physics: physics,
                    lanes: []
                };

                proxy = proxy[body.id];
                renderproxy = create('broker.bodies.renderer', proxy, this);

                physics.add(create(
                    'physics.renderer', renderproxy, body
                ).renderer);

                physics.add(create(
                    'physics.body.lane.bezier', body.lane, this.world
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
                        opts.x + (i%60)*2, 
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
