
   (function (physics) {


    //
    // BEHAVIOURS
    //
    physics.behavior('norne', function(parent){

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
             * Apply acceleration between all bodies
             */
            behave: function( data ){
                var bodies, body, reference, j, g, scratch, pos, normsq;

                bodies = data.bodies;
                scratch = physics.scratchpad();
                reference = bodies.forcefield;
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
                var polygons, polygon, points;

                polygons = [];
                points = this.lane.getPoints().slice();

                while (points.length > 1) {
                    polygon = this.createPolygon(points);
                    polygons.push(polygon);
                }

                return polygons;
            }

        }, function (lane) {
            this.lane = lane;
        });

    define('physics.body.lane.bezier')
        .uses('physics.body.lane')
        .as(function (lane) {
            var vertices, that;

            this.bodies = [];

            that = this;
            vertices = this.createVertices();
            console.log('physics.body.lane.bezier vertices', vertices);

            _(vertices).each(function (v) {
                that.bodies.push(physics.body('convex-polygon', {
                    x: v[0].x, y: 300, angle: 180,
                    vertices: v,
                    fixed: true
                }));
            });
            
        });


    define('physics.body.force.field')
        .as(function (x, y) {

            this.body = physics.body('circle', {
                x:x, y:y,
                mass: 0.5, radius: 100,
                restitution: 10, fixed: true
            });

        });



    define('physics.body.particle.circle')
        .as(function (x, y, r) {
            this.body = physics.body('circle', {
                x:x, y:y, mass: 0.1, radius: r,
                restitution: 0
            });
        });







    //
    // RENDERER
    //
    define('physics.renderer')
        .as(function (renderer, body) {
            var id;

            id = 'norne-' + body.id;
            physics.renderer(id, function (proto) {
                _(proto).extend(renderer);
            });

            this.renderer = physics.renderer(id);
        });





    /**
     *
     *
     *
     *
     */
    define('physics.world').as(function (opts) {

        this.world = physics({
            timestep: 1000/30,
            maxIPF: 6,
            integrator: 'verlet'
        });

        this.world.add([
            //physics.behaviour('norne'),
            physics.behaviour('constant-acceleration'),
            physics.behaviour('body-impulse-response'),
            physics.behaviour('sweep-prune'),
            physics.behaviour('body-collision-detection', { checkAll: false }) 
        ]);

    });


   }(Physics));
