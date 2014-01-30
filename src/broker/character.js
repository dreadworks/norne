
    /**
     *  The broker that handles proxy.character
     */
    define('broker.character')
        .uses('util.evt')
        .as({

            update: function () {
                var x, y, mapped, sizefac;

                if (this.character === undefined || this.character.lane === undefined) {
                    return;
                }

                this.proxy.frame = this.character.getAnimation().getFrame();

                x = this.character.x - this.world.pos();
                y = this.character.y;
                mapped = this.world.map(this.character.lane.dist, {x: x, y: y});

                this.proxy.x = mapped.x;
                this.proxy.y = mapped.y;

                this.proxy.angle = this.character.angle;
                this.proxy.direction = this.character.direction;

                sizefac = 1 - (this.character.lane.dist / 110);
                this.proxy.width = this.proxy.frame.width * this.character.width * sizefac;
                this.proxy.height = this.proxy.frame.height * this.character.height * sizefac;

                this.trigger('update');
            }

        }, function (parent, character, characterproxy) {
            var that = this;

            this.parent = parent;
            this.character = character;
            this.proxy = characterproxy;
            this.bezier = undefined;
            
            this.world = parent.world;

            this.proxy.image = character.image;

            this.character.on('changedAnimation', _(this.update).bind(this));
            this.world.on('posChanged', _(this.update).bind(this));

        });
