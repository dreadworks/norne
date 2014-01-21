describe("core.character.spritesheet", function () {

    it("init spritesheet with image", function () {
        var spritesheet;

        spritesheet = norne.obj.create('data.character.spritesheet', {
            image: 'animage.png'
        });

        expect(spritesheet.image).toEqual('animage.png');
    });


    it("add some frames to a sprite", function () {
        var sprite, frame;

        sprite = norne.obj.create('data.character.sprite', {
            fwidth: 100,
            fheight: 100,
            startx: 0,
            starty: 0,
            columns: 3,
            rows: 1
        });


        frame = sprite.frame();

        expect(frame).toBeDefined();
        expect(sprite.frames).toBeDefined();
        expect(sprite.frames.length).toEqual(3);
        expect(frame.x).toBeDefined();

        expect(frame.y).toBeDefined();
        
    });

    it("test the sprite frame calculation", function () {
        var sprite, frame;

        sprite = norne.obj.create('data.character.sprite', {
            fwidth: 100,
            fheight: 100,
            startx: 0,
            starty: 0,
            columns: 3,
            rows: 1
        });


        frame = sprite.frame();


        
        expect(frame).toBeDefined();
        expect(sprite.frames).toBeDefined();
        expect(sprite.frames.length).toEqual(3);
        expect(frame.x).toBeDefined();

        expect(frame.y).toBeDefined();
        

    });


});