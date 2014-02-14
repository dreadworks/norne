
    /**
     *  Import a whole word from a 
     *  json file.
     *
     */
     define('persist.import')
         .uses('util.evt')
         .as({


            body: function (lane, opts) {
                var body = this.world.createBody(lane);

                    _(opts.forces).each(function (force) {
                        body.addForce(force);
                    });

                    body.particles(opts.particles);
                    this.trigger('bodyLoaded', body);
            },


            bodies: function (lane, bodies) {
                var that = this;

                _(bodies).each(function (opts) {
                    that.body(lane, opts);
                });

                this.trigger('bodiesLoaded', bodies);
            },


            /**
             *  Imports and configures a lane.
             *
             *  Properties of the lane object:
             *    dist: Number
             *    color: String
             *    renderer: Object
             *      ground: String
             *      color: String
             *    points: Array
             *      points[i]: Object
             *        x: Number
             *        y: Number
             *
             *  @param lanes Lane configuration
             *  @type lane Object
             */
            lanes: function (lanes) {
                var that = this;

                _(lanes).each(function (opts) {
                    var lane = that.world.createLane(opts.dist);

                    lane.renderer(opts.renderer);
                    lane.color(opts.color);                    
                    lane.addPoints(opts.points);
                    that.trigger('laneLoaded', lane);

                    that.bodies(lane, opts.bodies);
                });

                that.trigger('lanesLoaded', lanes);
            },


            import: function (data) {
                this.lanes(data.lanes);
            },

            start: function () {
                this.xhr.get(this.file);
            }

         }, function (file, world) {
            var that, xhr;
            this.world = world;

            that = this;
            xhr = norne.xhr();

            xhr.on('success', function (res) {
                that.trigger('fileLoaded');                
                that.import(JSON.parse(res.data));
                that.trigger('importDone');
            });

            this.file = file;
            this.xhr = xhr;
         });



    define('persist.export')
        .uses('util.evt')
        .as({

        });
