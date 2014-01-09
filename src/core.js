(function () {
    'use strict';

    var norne, exc;


    norne = function (opts, callback) {
        callback.call(norne, norne.world(opts));
    };

    exc = { toString: function () { return this.name; } };


    /**
     *  basic functionality
     */
    _(norne).extend({

        debug: true,
        version: '0.0.1',

        exception: exc,

        /**
         * Used to extend norne itself.
         *
         * @param {String} name Name of the extension
         * @param {Object} opts Optional object whos properties
         *                      are getting mapped to fn
         * @param {Function} fn Optional function that can be invoked as norne[name]()
         *                      
         */
        register: function (name, opts, fn) {
            var registerExc = _(exc).extend({ name: 'norne.registerException' }),
                proxy;

            if (!_(name).isString()) {
                throw _(exc).extend({
                    message: 'First parameter must be a string.'
                });
            }

            if (norne[name]) {
                throw _(exc).extend({
                    message: 'Module with this name already exists (' + name + ')'
                });
            }

            if (_(opts).isFunction()) {
                fn = opts;
                opts = {};
            }

            opts = opts || {};
            
            if (fn) {
                proxy = function () {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(norne);
                    return fn.apply(norne[name], args);
                };

                _(proxy).extend(opts);
                norne[name] = proxy;                
            } else {
                norne[name] = opts;
            }

        },

        toString: function () {
            return 'Norne Engine Version ' + this.version;
        }
    });

    window.norne = norne;
}());