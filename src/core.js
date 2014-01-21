
    /**
     *  Norne base function. Will get exposed to the
     *  global namespace.
     */
    var norne = function (opts, callback) {
        var n = norne.obj.create('core.env');
        if (_(callback).isFunction()) {
            callback(n);
        }
        return n;
    };


    /**
     *  Basic properties.
     */
    _(norne).extend({
        debug: true,
        version: '0.0.1'
    });
