
    /**
     *  The broker that handles proxy.character
     */
    define('broker.character')
        .uses('util.evt')
        .as({

            update: function () {
                this.proxy.frame = this.character.getAnimation.getFrame();
                this.trigger('update');
            }

        }, function (parent, character, characterproxy) {
            var that = this;

            this.parent = parent;
            this.character = character;
            this.proxy = characterproxy;

            this.proxy.image = character.image;

            this.character.on('changedAnimation', this.update);

        });
