
    (function (physics) {

    //
    //  BEHAVIOURS
    //
    /**
     *  Initially, this was the newtonian behaviour.
     */
    physics.behavior('forcefield', function(parent) {

        var defaults = {
            strength: 1
        };

        return {

            init: function( options ){

                // call parent init method
                parent.init.call(this, options);

                options = physics.util.extend({}, defaults, options);

                this.strength = options.strength;
                this.tolerance = options.tolerance || 100 * this.strength;
            },
            

            /**
             * Apply acceleration to particles towards forcefields.
             */
            behave: function(data) {
                var bodies, body, reference, j, g, scratch, pos, normsq;

                bodies = data.bodies;
                scratch = physics.scratchpad();
                reference = bodies.forcefields;
                pos = scratch.vector();

                if (reference === undefined) {
                    scratch.done();
                    return;
                }

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



    //
    // BODIES
    //
    /**
     *  Base class for all PhysicsJS lane bodies.
     */
    define('physics.body.lane')
        .as({

            direction: function (p1, p2) {
                return p2.y-p1.y > 0;
            },

            changedDirection: function (p1, p2, direction) {
                return !(this.direction(p1, p2) ^ direction);
            },

            createPolygon: function (points) {
                var polygon, 
                    direction, convex,
                    next, current, min;

                polygon = [];
                convex = true;
                direction = this.direction(points[0], points[1]);

                polygon.push(points.shift());

                while(points.length) {
                    next = points[0];
                    current = polygon[0];

                    polygon.unshift(next);

                    if (this.changedDirection(current, next, direction)) {
                        if (!convex) {
                            break;
                        }

                        direction = !direction;
                        convex = false;
                    }

                    points.shift();
                }

                min = _(polygon).min(function (p) { 
                    return p.y; 
                }).y;

                min = (min > 0) ? 0:min;

                current = _(polygon).first();
                if (current.y !== min) {
                    polygon.unshift({
                        x:current.x, y:min
                    });
                }

                current = _(polygon).last();
                if (current.y !== min) {
                    polygon.push({
                        x:current.x, y:min
                    });
                }

                return polygon;
            },


            createVertices: function () {
                var that, polygons, polygon, points;

                that = this;
                polygons = [];
                points = this.lane.getPoints().slice();

                /*
                points = _(points).map(function (p) {
                    p.y = that.world.height() - p.y;
                    return p;
                });
                */

                while (points.length > 1) {
                    polygon = this.createPolygon(points);
                    polygons.push(polygon);
                }

                return polygons;
            }

        }, function (lane, world) {
            this.lane = lane;
            this.world = world;
        });


    /**
     *  The definition of the lanes simple ground
     *  as a PhysicsJS body to repell particles.
     *
     *  TODO #14
     */
    define('physics.body.lane.simple')
        .uses('physics.body.lane')
        .as(function (lane) {
            var vertices, that;

            this.bodies = [];
            
            that = this;
            vertices = this.createVertices();

            _(vertices).each(function (v) {
                var polygon, pos, bb, hh, hw;

                polygon = physics.body('convex-polygon', {
                    angle: 0,
                    vertices: v,
                    fixed: true
                });

                bb = polygon.geometry.aabb();
                pos = polygon.state.pos;

                hh = bb.halfHeight;
                hw = bb.halfWidth;

                pos.set(
                    v[v.length-1].x + hw - Math.abs(bb.pos.x),
                    -bb.pos.y + hh
                );

                that.bodies.push(polygon);
            });
            
        });


    /**
     *  The definition of the lanes bezier ground
     *  as a PhysicsJS body to repell particles.
     *
     *  TODO #12
     *  TODO #14
     */
    define('physics.body.lane.bezier')
        .uses('physics.body.lane')
        .as(function (lane) {
            var vertices, polygons, that;

            this.bodies = [];
            
            that = this;
            vertices = this.createVertices();

            vertices = _(vertices).map(function (polygon) {
                var bezier, i, a, b;

                i = 1;
                while (i<polygon.length) {

                    a = polygon[i-1];
                    b = polygon[i];

                    if (a.x === b.x) {
                        i += 1;
                        continue;
                    }

                    bezier = create('util.bezier', [a, b]);
                    bezier = bezier.sequence(5);

                    // replace the two points with
                    // the new bezier sequence
                    bezier.unshift(i, 0);
                    Array.prototype.splice.apply(polygon, bezier);

                    // skip sequence
                    i += bezier.length - 1;
                }

                return polygon;
            });
            console.log(vertices);
            
            polygons = [];
            (function (that) {
                var i = 1;
                _(vertices).each(function (polygon) {
                    while (i < polygon.length) {
                        console.log('vertices.slice', i-1, i);
                        polygons.push(that.createPolygon(
                            polygon.slice(i-1, i+1)
                        ));

                        i += 1;
                    }
                });
            }(this));


            _(polygons).each(function (v) {
                var polygon, pos, bb, hh, hw;

                polygon = physics.body('convex-polygon', {
                    angle: 0,
                    vertices: v,
                    fixed: true
                });

                bb = polygon.geometry.aabb();
                pos = polygon.state.pos;

                hh = bb.halfHeight;
                hw = bb.halfWidth;

                pos.set(
                    v[v.length-1].x + hw - Math.abs(bb.pos.x),
                    that.world.height() - bb.pos.y - hh
                );

                that.bodies.push(polygon);
            });
            
        });


    /**
     *  Base class for force fields.
     */
    define('physics.body.force.field')
        .as(function (x, y) {

            this.body = physics.body('circle', {
                x:x, y:y,
                mass: 0.5, radius: 100,
                restitution: 10, fixed: true
            });

        });


    /**
     *  Particle base class for round circles.
     */
    define('physics.body.particle.circle')
        .as(function (x, y, r) {

            this.body = physics.body('circle', {
                x:x, y:y, mass: 0.01, radius: r,
                restitution: 0
            });

        });



    //
    //  RENDERER
    //
    /**
     *  A new renderer must be created for
     *  every body that gets appended.
     *  The 'renderer' that gets used by
     *  the PhysicsJS world is just used to
     *  (re)fill the proxy object.
     */
    define('physics.renderer')
        .as(function (renderer, body) {
            var id;

            id = 'norne-' + body.id;
            physics.renderer(id, function (proto) {
                _(proto).extend(renderer);
            });

            this.renderer = physics.renderer(id);
        });



    //
    //  WORLD
    //
    /**
     *  Entity that serves as the physical
     *  world for the particles defined in
     *  the corresponding data.body.
     */
    define('physics.world').as(function (opts) {

        this.world = physics({
            timestep: 1000/30,
            maxIPF: 6,
            integrator: 'verlet'
        });

        console.log('Foo', this.world);

        this.world.add([
            //physics.behaviour('norne'),
            physics.behaviour('newtonian'),
            //physics.behaviour('constant-acceleration', { acc: { y: -0.00009, x:0 }}),
            physics.behaviour('body-impulse-response'),
            physics.behaviour('sweep-prune'),
            physics.behaviour('body-collision-detection', { checkAll: false }) 
        ]);

    });


   }(Physics));
