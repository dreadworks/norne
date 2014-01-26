
    /**
     *  Norne base function. Will get exposed to the
     *  global namespace.
     */
    norne = function (opts, callback) {
        var n = norne.obj.create('core.world', opts);
        if (_(callback).isFunction()) {
            callback(n);
        }
        return n;
    };


    /**
     *  Basic properties.
     */
    _(norne).extend({
        version: '0.0.1'
    });
