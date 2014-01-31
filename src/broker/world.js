
    /**
     *  Instances of this object sit between /core and /render.
     *  They handle calculations to transform pixel values handed
     *  from core.world to viewport pixel values. They also serve
     *  as a cache for retrieved values.
     */
    define('broker.world')
        .uses('util.evt')
        .as({

            /**
             *  Add a new subbroker to work on a set of data.
             *  You can pass an arbitrary set of arguments
             *  that will get passed through to the subbrokers
             *  constructor function. The broker listens on a
             *  a subbrokers 'update' event to initiate a repaint
             *  of the canvas.
             *
             *  @param name Object definition: render.broker.<name>
             *  @type name String
             */
            add: function (name) {
                var args, subbroker;

                args = _(arguments).toArray();
                args.shift();

                args.unshift(this);
                args.unshift('broker.' + name);

                subbroker = create.apply(norne.obj, args);

                this.broker[name] = subbroker;
                subbroker.on('update', this.render);

                return subbroker;
            }

        /**
         *  Constructor.
         *
         *  @param world A norne world
         *  @type world core.world
         *  @param canvas The context where everything gets drawn to
         *  @type canvas Element
         *  @param clock The rendering clock
         *  @type clock render.clock
         */
        }, function (world, canvas, clock) {

            this.canvas = canvas;
            this.world = world;
            this.render = _(clock.mark).bind(clock);

            this.proxy = {
                lanes: [],
                character: {},
                bodies: {}
            };

            this.broker = {};

        });
