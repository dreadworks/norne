
    define('util.exc.exception')
        .as({

            toString: function () {
                return this.name;
            }

        }, function (name, msg) {
            this.name = name;
            this.message = msg;
        });
        

    define('util.exc')
        .as({

            _construct: function (name) {
                this.raise._name = name;
            },

            /**
             *  Raises an exception. The exceptions
             *  name will be the modules name.
             *
             *  @param msg The exceptions message
             *  @type msg String
             */
             raise: function (msg) {
                throw create('util.exc.exception', this.raise._name, msg);
             }
        });


    /**
     *  For non-module related
     *  exceptions.
     */     
    norne.register('exc', {
        raise: function (name, message) {
            throw create('util.exc.exception', name, message);
        }
    });
