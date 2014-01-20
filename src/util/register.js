	
	/**
     *  Define singletons that extend the norne library
     */
    _(norne).extend({

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
            var proxy;

            if (norne[name]) {
                norne.exc.raise(
                    'norne.register',
                    'Module with this name already exists (' + name + ')'
                );
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


        /**
         *  Remove a registered module from norne.
         *  Returns true if deletion was successful.
         *
         *  @param name The modules name
         *  @type name String
         */
        unregister: function (name) {
            if (norne[name]) {
                return delete norne[name];    
            }
            return false;
        },


        /**
         *  String representation of norne.
         */
        toString: function () {
            return 'Norne Engine Version ' + this.version;
        }
    });
