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

});