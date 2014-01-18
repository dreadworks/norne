
    /**
     *  Norne base function. Will get exposed to the
     *  global namespace.
     */
    var norne = function (opts, callback) {
        var n = norne.obj.create('core.norne');
        if (_(callback).isFunction()) {
            callback.call(n);
        }
        return n;
    };


    _(norne).extend({
        debug: true,
        version: '0.0.1'
    });
