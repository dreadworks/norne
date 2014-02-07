describe('norne.exc', function () {

    it('should let me throw exceptions', function () {

        expect(norne.exc).toBeDefined();
        expect(norne.exc.raise).toBeDefined();

        expect(norne.exc.raise).toThrow();

    });


    it('should handle the arguments', function () {

        try {
            norne.exc.raise('test', 'message');
        } catch(e) {
            expect(e.name).toEqual('test');
            expect(e.message).toEqual('message');
        }

    });


    it('should work with norne.obj.define', function () {
        var obj, msg;

        msg = 'stuff went wrong';

        norne.obj.define('test')
            .uses('util.exc')
            .as({

                fail: function () {
                    this.raise(msg);
                }

            });

        obj = norne.obj.create('test');
        expect(obj.fail).toThrow();

        try {
            obj.raise(msg);
        } catch (e) {
            expect(e.name).toEqual('test');
            expect(e.message).toEqual(msg);
        }

        norne.obj.erase('test');
    });

});