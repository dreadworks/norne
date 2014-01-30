
    /**
     *  The broker that handles proxy.character
     */
    define('broker.character')
        .uses('util.evt')
        .as({

            setCharacterPosition: function (pos, width) {
                var x, pt, points;
                x = pos + (width / 2);

                if (this.bezier === undefined || !this.bezier.inRangeX(x)) {
                    points = this.character.lane.getPalingPoints(x);
                    if (points === undefined) {
                        return;
                    }
                    this.bezier = create('util.bezier', points);                     
                } 

                pt = this.bezier.getY(x);

                this.character.setPos(x, pt.y, pt.angle);
            },

            update: function () {
                if (this.character === undefined) {
                    return;
                }

                this.proxy.dist = this.character.lane.dist;
                this.proxy.frame = this.character.getAnimation().getFrame();

                this.proxy.x = this.character.x - this.world.pos();
                this.proxy.y = this.world.height() - this.character.y;

                this.proxy.angle = this.character.angle;

                this.proxy.width = 80;
                this.proxy.height = 120;

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
            this.character.on('changedPos', _(this.update).bind(this));
            

            this.world.on('posChanged', _(this.setCharacterPosition).bind(this));

        });
