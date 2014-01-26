
    /**
     *  The broker that handles proxy.character
     */
    define('broker.character')
        .uses('util.evt')
        .as({

            setCharacterPosition: function (pos, width) {
                var x, y;

                x = width / 2;
                y = 200;



                this.character.setPos(x, y);
            },

            update: function () {
                if (this.character === undefined) {
                    return;
                }

                this.proxy.frame = this.character.getAnimation().getFrame();

                this.proxy.x = this.character.x;
                this.proxy.y = this.character.y;

                this.proxy.width = 80;
                this.proxy.height = 120;

                this.trigger('update');
            }

        }, function (parent, character, characterproxy) {
            var that = this, world;

            this.parent = parent;
            this.character = character;
            this.proxy = characterproxy;
            this.bezier = undefined;
            
            world = parent.world;

            this.proxy.image = character.image;

            this.character.on('changedAnimation', _(this.update).bind(this));
            this.character.on('changedPos', _(this.update).bind(this));

            world.on('posChanged', _(this.setCharacterPosition).bind(this));

        });
