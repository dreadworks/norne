describe('util.bezier', function () {

    


    it('should let me calculate for parameters t', function () {
        var bezier = norne.obj.create('util.bezier',
            [
                {x: 50, y: 50},
                {x: 100, y: 100}
            ]
        );

        var coord = bezier.getPoint(0.01);
        console.info("x: " + coord.x, ", y: " + coord.y, ", ang: " + coord.angle);
    });

    it('should let me calc an y-value for a given x-value', function () {
        var bezier = norne.obj.create('util.bezier',
            [
                {x: 50, y: 50},
                {x: 100, y: 10}
            ]
        );

        var y = bezier.getY(75);
        //console.info(y);
    });

});