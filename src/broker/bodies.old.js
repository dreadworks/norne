
    /** 
     *  The broker for bodies. Serves as the
     *  physicsjs renderer 'norne'.
     */
    define('broker.bodies')
        .uses('util.evt')
        .as({

            /**
             *  Everytime the simulation advances the
             *  render method gets called. More information
             *  can be found in the physicsjs wiki
             *  and documentation.
             */
            render: function (bodies, meta) {
                var that, proxy, dist, offset, paling;

                if (!bodies.length) {
                    return;
                }

                that = this;
                dist = bodies[0].options.dist;
                offset = -this.map(dist, this.world.pos());

                proxy = 
                    this.proxy.particles[dist] || 
                    (this.proxy.particles[dist] = []);

                _(bodies).each(function (body, i) {
                    var elem, pos;

                    pos = body.state.pos;
                    elem = proxy[i] || (proxy[i] = {});

                    elem.x = offset + pos.get(0);
                    elem.y = pos.get(1);

                    proxy[i] = that.map(dist, elem);
                    proxy[i].r = that.map(dist, body.geometry.radius);
                });

                this.trigger('update');
            }


        /** 
         *  Constructor
         *
         *  @param parent The parent broker
         *  @type parent broker.world
         */
        }, function (parent) {

            var world = parent.world;

            this.world = world;
            this.proxy = parent.proxy.bodies;

            this.proxy.particles = {};

            // otherwise the context would be a
            // physicsjs instance
            this.render = _(this.render).bind(this);
            this.map = _(this.world.map).bind(this.world);

            // TODO
            //world.on('posChanged', _(this.update).bind(this));

        });
        