

    define('core.story')
        .uses('util.evt')
        .as({

            index: function (pos) {
                pos = (pos.start === undefined) ? {start:pos} : pos;
                return _(this.twists).sortedIndex(pos, 'start');
            },

            skip: function (pos) {
                var index;
                index = this.index(pos);
            },

            twist: function (opts, fn) {
                var index;
                index = this.index(opts);
                this.twists.splice(index, 0, opts);
            }

        }, function (world) {

            this.pos = 0;
            this.twists = [];

            world.on('posChanged', _(this.skip).bind(this));

        });