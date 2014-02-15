
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
    define('physics.body.lane.bezier')
        .as(function (lane) {
            var vertices;

            //vertices = lane.getPoints();
            //vertices.push({x:0,y:0});
            vertices = [
                { x:200, y:100 },
                { x:220, y:150 },
                { x:250, y:150 },
                { x:300, y:50  }
            ];

            console.log('physics.body.lane.bezier vertices', vertices);

            this.body = physics.body('convex-polygon', {
                x: 0, y: 0,
                vertices: vertices,
                fixed: true
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