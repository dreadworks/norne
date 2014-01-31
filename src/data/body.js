
    // TODO #5
    Physics.behavior('norne', function( parent ){

        var defaults = {
            strength: 1
        };

        return {

            /**
             * Initialization
             */
            init: function( options ){

                // call parent init method
                parent.init.call(this, options);

                options = Physics.util.extend({}, defaults, options);

                this.strength = options.strength;
                this.tolerance = options.tolerance || 100 * this.strength;
            },
            
            /**
             * Apply norne acceleration between all bodies
             */
            behave: function( data ){
                var bodies, body, reference, j, g, scratch, pos, normsq;

                bodies = data.bodies;
                scratch = Physics.scratchpad();
                reference = bodies.forcefield;
                pos = scratch.vector();

                for (j = 0; j < bodies.length; j++) {

                    body = bodies[j];

                    // clone the position
                    pos.clone( reference.state.pos );
                    pos.vsub( body.state.pos );

                    // get the square distance
                    normsq = pos.normSq();

                    if (normsq > this.tolerance){
                        g = this.strength / normsq;
                        body.accelerate( pos.normalize().mult( g * reference.mass ) );
                    }
                }

                scratch.done();
            }
        };
    });


    /**
     *  Object that describes the force fields
     *  that magnetically attracts particles.
     *
     *  @param x X-Coordinate
     *  @type x Number
     *  @param y Y-Coordinate
     *  @type y Number
     *  @param dist Dist of the bodies lane
     *  @type dist Number
     */
    define('data.body.forcefield')
        .as(function (x, y, dist) {
            this.body = Physics.body('circle', {
                x: x, y: y, dist: dist,
                mass: 0.5, radius: 100,
                restitution: 10, fixed: true
            });
        });


    /**
     *  Base object for particles.
     *
     *  @param x X-Coordinate
     *  @type x Number
     *  @param y Y-Coordinate
     *  @type y Number
     *  @param dist Dist of the bodies lane
     *  @type dist Number
     */
    define('data.body.particle')
        .as(function (x, y, dist) {
            this.body = Physics.body('circle', {
                x: x, y: y, dist: dist,
                mass: 0.1, radius: _.random(2,7),
                restitution: 0
            });
        });


    /**
     *  A body describes a set of physical rules
     *  to make a cloud of particles form abstract
     *  shapes.
     */
    define('data.body')
        .uses('util.evt')
        .as({

            /**
             *  Add a particle to the physics world
             */
            _addParticle: function () {
                this.physics.add(
                    create('data.body.particle',
                        this.forcefields[0].options.x + _.random(10, 40),
                        this.forcefields[0].options.y + _.random(10, 40),
                        this.lane.dist
                    ).body
                );
            },


            /**
             *  Set the number of particles that
             *  form the body.
             *
             *  @param n New number of particles
             *  @type n Number
             */             
            particles: function (n) {
                if (_(n).isNumber()) {

                    while (this._particles < n) {
                        this._addParticle();
                        this._particles += 1;
                    }

                    this.trigger('particlesChanged', n);
                }

                return this._particles;
            },


            /**
             *  Set the color of the particles.
             *  Enhancement: #6
             *
             *  @param h Hue value
             *  @type h Number
             *  @param s Saturation value
             *  @type s Number
             *  @param l Lightness
             *  @type l Number
             */
            color: function (h, s, l) {
                if (_(arguments).every(_.isNumber)) {
                    this._color = 'hsl('+ h +', '+ s +'%, '+ l +'%)';
                    this.trigger('colorChanged', this._color);
                }

                return this._color;
            },


            /** 
             *  Set the lane on which the body
             *  gets rendered and constrained.
             *
             *  @param lane The lane
             *  @type lane data.lane
             */
            lane: function (lane) {
                this.lane = lane;
            },


            /** 
             *  Set the forcefield that attracts
             *  the particles.
             *
             *  @param x X-Coordinate
             *  @type x Number
             *  @param y Y-Coordinate
             *  @type y Number
             */
            forcefield: function (x, y) {
                var ff = create('data.body.forcefield', x, y, this.lane.dist);
                this.forcefields.push(ff.body);
                this.physics._bodies.forcefield = ff.body;
            }


        /** 
         *  The constructor
         *
         *  @param physics A physicsjs world
         *  @type physics Physics()
         *  @param clock To set the physicsjs simulation step
         *  @type clock util.clock
         *  @param opts An options object
         *  @type opts Object
         */
        }, function (physics, clock, opts) {
            var defaults;

            defaults = {
                color: { h: 0, s: 0, l: 0 }
            };

            this._particles = 0;

            this.physics = physics;
            this.clock = clock;

            opts = _(defaults).extend(opts);

            this.forcefields = [];
            this.color(opts.color.h, opts.color.s, opts.color.l);


            // init behaviours
            physics.add([
                Physics.behaviour('edge-collision-detection', {
                    // TODO
                    aabb: Physics.aabb(0, 0, 2000, 500000),
                    restitution: 0.5,
                    cof: 1
                }),
                Physics.behaviour('body-impulse-response'),
                Physics.behaviour('norne'),
                //Physics.behaviour('newtonian', { strength: 0.01 }),
                Physics.behaviour('sweep-prune'),
                Physics.behaviour('body-collision-detection', { checkAll: false })
            ]);

            window.p = physics;


            // TODO #4
            clock.on('tick', function () {
                physics.step(Date.now());
                physics.render();
            });
        });


    /**
     *  Maintains data.body collections
     */
    define('data.bodies')
        .uses('util.evt')
        .as({

            /**
             *  Add a body to the collection.
             *
             *  @param body Body to be added
             *  @type body data.body
             */
            add: function (body) {
                var that;
                this.bodies.push(body);

                that = this;
                this.on('particlesChanged', function (n) {
                    that.trigger('particlesChanged', this, n);
                });
            }

        }, function () {
            this.bodies = [];
        });
