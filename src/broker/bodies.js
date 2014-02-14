

    define('broker.bodies')
        .uses('util.evt')
        .as({

            render: function (bodies, meta) {

            },


            proxy: function (dist) {
                var index, proxy;

                index = this._lanebroker.index(dist);
                proxy = this._proxy[index].bodies;
                proxy = proxy || (this._proxy[index].bodies = {});

                return proxy;
            },


            createEntry: function (body) {
                var index, proxy;
                console.log('broker.bodies.createEntry', body);

                proxy = this.proxy(body.lane.dist);

                proxy[body.id] = {
                    // todo physics.world
                };

                proxy = proxy[body.id];


            },


            changeParticles:  function (body, opts) {
                var proxy;

                proxy = this.proxy(body.lane.dist);
            },




        }, function (parent, bodies) {
            var that = this;

            // it uses the lane proxy, since
            // bodies are always bound to a lane
            // @see render.world.repaint
            this._proxy = parent.proxy.lanes;
            this._lanebroker = parent.broker.lanes;

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
        });
