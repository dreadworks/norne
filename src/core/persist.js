
    /**
     *  Import a whole word from a 
     *  json file.
     *
     */
     define('persist.import')
         .uses('util.evt')
         .as({


            lanes: function (lanes) {
                var that = this;

                _(lanes).each(function (opts) {
                    var lane = that.world.createLane(opts.dist);

                    lane.color(opts.color);
                    lane.renderer(opts.renderer);
                    lane.addPoints(opts.points);

                    that.trigger('laneLoaded', lane);
                });

                that.trigger('lanesLoaded', lanes);
            },


            import: function (data) {
                this.lanes(data.lanes);
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

            xhr.get(file);
         });



    define('persist.export')
        .uses('util.evt')
        .as({

        });
