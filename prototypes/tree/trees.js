


(function ($) {
    'use strict';


    var worlds;


    function init_world(world) {
        var bounds, behaviours, canvas,
            id, particles, renderer,
            forcefields;

        id = _.random(0, 200);
        world.canvasId = id;

        // create canvas element and append to body
        canvas = $('<canvas/>', {id: world.canvasId}).appendTo('body')

        bounds = Physics.aabb(
            0, 0,
            canvas.width(),
            canvas.height()
        );

        behaviours = [];
        behaviours.push(
            Physics.behaviour('edge-collision-detection', {
                aabb: bounds,
                restitution: 0.5,
                cof: 1
            }),
            Physics.behaviour('body-impulse-response'),
            Physics.behaviour('newtonian', { strength: 0.01 }),
            Physics.behaviour('sweep-prune'),
            Physics.behaviour('body-collision-detection', { checkAll: false })
        );

        world.add(behaviours);


        particles = [];
        _.times(130, function () {
            particles.push(Physics.body('circle', {
                x: _.random(
                    20,
                    canvas.width()
                ),
                y: _.random(
                    20,
                    canvas.height()
                ),
                mass: 0.1,
                radius: _.random(10,10),
                restitution: 0
            }));
        });

        world.add(particles);


        forcefields = [];
        forcefields.push(Physics.body('circle', {
            x: 150,
            y: 250,
            mass: 130,
            radius: 2,
            restitution: 0,
            fixed: true
        }));
        forcefields.push(Physics.body('circle', {
            x: 100,
            y: 120,
            mass: 70,
            radius: 2,
            restitution: 0,
            fixed: true
        }));

        world.add(forcefields);


        renderer = Physics.renderer('canvas', {
            el: '' + world.canvasId,
            width: canvas.width(),
            height: canvas.height(),
            meta: true,
            styles: {
                'circle': {
                    lineWidth: 5,
                    strokeStyle: 'rgba(0, 0, 0, 0)',
                    angleIndicator: 'rgba(0, 0, 0, 0)',
                    fillStyle: 'hsl(3, 100%, 63%)'
                },
                'forcefield': {
                    lineWidth: 5,
                    strokeStyle: 'rgba(0, 0, 0, 0)',
                    angleIndicator: 'rgba(0, 0, 0, 0)',
                    fillStyle: 'hsl(3, 100%, 63%)'  
                }
            }
        });
        world.add(renderer);

    }



    $(function () {
        var world, $cntrl, paused;

        worlds = [];

        _.times(20, function () {
            world = new Physics({
                timestep: 3,
                maxIPF: 6
            });
            init_world(world);
            worlds.push(world);
        })

        paused = false;
        $cntrl = $('#cntrl');

        $cntrl.on('click', function () {
            if (paused) {
                Physics.util.ticker.start();
            } else {
                Physics.util.ticker.stop();
            }
            paused = !paused;
        })


        /*
         * Register world to global ticker
         */
        Physics.util.ticker.subscribe(function (time, dt) {
            _.each(worlds, function (world) {
                    world.step(time);
                if (true) {
                    world.render();
                }
            })
        });

        Physics.util.ticker.start();
        
    });


}(jQuery));