describe('core.story (position based)', function () {

    var world, spy;

    beforeEach(function () {
        world = norne({
            depth: 100,
            canvas: {
                nodeType: 1,
                appendChild: function () {}
            }
        });

        spy = { callback: function (depth) {
            world.depth(depth);
        }};
        spyOn(spy, 'callback');

        world.addTwist({
            start: 100,
            end: 200,
            from: 100,
            to: 50
        }, spy.callback);
    });


    it('should be accessible', function () {
        expect(world.addTwist).toBeDefined();
    });
    

    it('lets me add twists', function () {
        world.pos(150);
        expect(spy.callback).toHaveBeenCalledWith(75);
    });


    it('calls the callback n-times', function () {
        for (var i = 0; i < 250; i++) {
            world.pos(i);
        }

        expect(spy.callback.callCount).toEqual(100);
        expect(world.depth()).toEqual(50);
    }); 


    it('can revert its changes', function () {
        world.pos(250);
        expect(world.depth()).toEqual(50);

        world.pos(0);
        expect(world.depth()).toEqual(100);
    });


    it('handles multiple twists', function () {
        world.addTwist({
            start: 250,
            end: 300,
            from: world.depth,
            to: 70
        }, function (depth) {
            world.depth(depth);
        });

        world.pos(350);
        expect(world.depth()).toEqual(70);

        world.pos(275);
        expect(world.depth()).toEqual(60);
    });

});