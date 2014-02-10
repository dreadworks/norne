
    /**
     *  Import a whole word from a 
     *  json file.
     *
     */
     define('persist.import')
         .uses('util.evt')
         .as({


            lanes: function (lanes) {
                
            },


            import: function (data) {
                this.lanes(data.lanes);
            }

         }, function (file, world) {
            var that, xhr;

            that = this;
            xhr = norne.xhr();
            
            xhr.on('success', function (res) {
                that.trigger('fileLoaded');                
                that.import(JSON.parse(res.data));
            });

            xhr.get(file);
         });



    define('persist.export')
        .uses('util.evt')
        .as({

        });
