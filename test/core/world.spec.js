describe('core.world', function () {

    // didn't want to include a whole
    // DOM library, so for now I trick
    // norne and _ in believing that
    // the canvas is a DOM element.
    var opts, e;

    opts = {
        canvas: { 
            nodeType: 1,
            appendChild: function () {}
        }
    };

    function e(d) {
        return _(opts).extend({ depth: d });
    }


    it('may be constructed with depth', function () {
        var world, world2;

        world = norne.obj.create('core.world', opts);

        expect(world.depth).toBeDefined();
        expect(world.depth()).toEqual(100);

        world = norne.obj.create('core.world', e(50));
        expect(world.depth()).toEqual(50);

        world2 = norne.obj.create('core.world', e(100));
        expect(world.depth()).toEqual(50);
        expect(world2.depth()).toEqual(100);
    });


    it('can handle depth() as a setter', function () {
        var world, depth;
        depth = 50;

        world = norne.obj.create('core.world', opts);
        expect(world.depth()).toEqual(100);

        expect(world.depth(depth)).toEqual(depth);
        expect(world.depth()).toEqual(depth); 
    });


    it('lets me add lanes', function () {
        var world, l1;

        world = norne.obj.create('core.world', opts);
        expect(world.createLane).toBeDefined();

        l1 = world.createLane(0);
        expect(l1).toBeDefined();
    });


    it('prevents me from adding two lanes with the same dist', function () {
        var world;

        world = norne.obj.create('core.world', opts);
        function add() {
            world.createLane(0);    
        }
        
        add();
        expect(add).toThrow();
    });

});

