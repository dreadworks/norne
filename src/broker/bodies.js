
    define('broker.bodies')
        .uses('util.evt')
        .as({

            update: function (pos) {
                console.log('broker.bodies.update pos', pos);
            },

            add: function (body, physics) {
                console.log('adding body', body, 'current physics', physics);
            }

        }, function (parent) {

            var world = parent.world;

            world.on('posChanged', _(this.update).bind(this));

        });