describe('core.story (position based)', function () {

    var world, storyline, spy, x;

    beforeEach(function () {
        var spywrapper;

        x = 0;
        world = norne({
            depth: 100,
            canvas: {
                nodeType: 1,
                appendChild: function () {}
            }
        });

        spy = { callback: function (z) {
            x = z;
        }};
        spyOn(spy, 'callback');

        spywrapper = function (z) {
            x = z;
            spy.callback(z);
        };

        storyline = world.addStoryline('depth');
        storyline.addTwist({
            start: 100,
            end: 200,
            from: 100,
            to: 50
        }, spywrapper);
    });


    it('should be accessible', function () {
        expect(world.addStoryline).toBeDefined();
        expect(storyline.addTwist).toBeDefined();
    });
    

    it('lets me add twists', function () {
        world.pos(150);
        expect(spy.callback).toHaveBeenCalledWith(75);
    });


    it('calls the callback n-times', function () {
        for (var i = 0; i < 250; i++) {
            world.pos(i);
        }

        // 100 iterations plus 1 update after iteration
        expect(spy.callback.callCount).toEqual(101);
        expect(x).toEqual(50);
    }); 


    it('can revert its changes', function () {
        world.pos(250);
        expect(x).toEqual(50);

        world.pos(0);
        expect(x).toEqual(100);
    });


    it('handles multiple twists', function () {
        storyline.addTwist({
            start: 250,
            end: 350,
            from: 50,
            to: 70
        }, function (z) {
            x = z;
        });

        world.pos(400);
        expect(x).toEqual(70);

        world.pos(300);
        expect(x).toEqual(60);
    });

});