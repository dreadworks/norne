jQuery(function () {
    'use strict';

    var $canvas, canvas, world,
        renderer, bounds, behaviours,
        forcefields, particles;


    world = new Physics();
    Physics.util.ticker.start();

    $canvas = jQuery('#viewport');
    canvas = {
        width: $canvas.width(),
        height: $canvas.height()
    };


    renderer = Physics.renderer('canvas', {
        el: 'viewport',
        width: canvas.width,
        height: canvas.height,
        meta: true,
        styles: {
            'circle': {
                lineWidth: 0,
                strokeStyle: 'rgba(0, 0, 0, 0)',
                angleIndicator: 'rgba(0, 0, 0, 0)',
                fillStyle: 'hsla(3, 70%, 39%, 1)'
            }
        }
    });

    world.add(renderer);
    world.subscribe('step', function() {
        world.render();
    });

    bounds = Physics.aabb(
        0, 0,
        canvas.width,
        canvas.height
    );

    behaviours = [];
    behaviours.push(
        Physics.behaviour('edge-collision-detection', {
            aabb: bounds,
            restitution: 1,
            cof: 1
        }),
        Physics.behaviour('body-impulse-response'),
        Physics.behaviour('newtonian', { strength: 0.001 }),
        Physics.behavior('sweep-prune'),
        Physics.behavior('body-collision-detection', { checkAll: false })
    );


    particles = [];
    _.times(150, function() {
        particles.push(Physics.body('circle', {
            x: _.random(canvas.width),
            y: _.random(canvas.height),
            mass: 1,
            radius: _.random(4,5),
            restitution: 0.1,
            cof: 0.5
        }));
    });

    forcefields = [];
    forcefields.push(Physics.body('circle', {
        x: canvas.width / 2,
        y: canvas.height / 2,
        mass: 20,
        radius: 10,
        fixed: true
    }));
    forcefields.push(Physics.body('circle', {
        x: canvas.width / 2 + 20,
        y: canvas.height / 2 + 100,
        mass: 50,
        radius: 10,
        fixed: true
    }));


    world.add(particles);
    world.add(renderer);
    world.add(forcefields);
    world.add(behaviours);


    var counter = 0;
    Physics.util.ticker.subscribe(function(time) {
        world.step(time);
        if (counter++ % 100 == 0) {
            world.render();
        }
    });


});