(function () {
    


    var log = {
            msg: function (msg) {
                if (console && console.log) {
                    console.log(msg);
                }
            },

            err: function (msg) {
                if (console && console.error) {
                    console.error(msg);
                }
            }
        },

        norne = function (opts, callback) {
            callback.apply(norne, norne.world(opts));
        };

    /**
     *  basic functionality
     */
    _(norne).extend({

        /**
         * Used to extend norne itself.
         *
         * @param {String} name Name of the extension
         * @param {Object} opts Optional object whos properties
         *                      are getting mapped to fn
         * @param {Function} fn Optional function that gets appended
         *                      
         */
        register: function (name, opts, fn) {

            if (norne[name]) {
                log.err('Module with this name already exists (' + name + ')');
                return
            }

            if (!_(name).isString()) {
                log.err('First parameter must be a string').
                return
            }

            if (norne[name] !== undefined) {
                log.err('An extension called "'+ name +'" already exists');
                return;
            }

            if (_(opts).isFunction()) {
                fn = opts
                opts = {}
            }

            opts = opts || {};
            fn = fn || function () {};

            /*
             *  bind opts context to the function
             *  and extend the returned proxy
             */
            fn = _(fn).bind(opts);
            _(fn).extend(opts);

            norne[name] = fn;
            return norne[name];
        }
    });

    norne.register('log', log, log.msg);
    window.norne = norne;
}());