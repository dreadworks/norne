describe("core.character.spritesheet", function () {


    it("be callable", function () {
        var characterfac = norne.obj.get('data.character');
        expect(characterfac).toBeDefined();
    });

    it("should let me create a character", function () {
        var character;

        character = norne.obj.create(
                'data.character',
                {
                    width: 100,
                    height: 100,
                    sprite: 'sprite_sheet.png'
                }
            );

        expect(character).toBeDefined();

    });

    it("should let me define sprites", function () {
        var character, callback;

        character = norne.obj.create(
                'data.character',
                {
                    width: 100,
                    height: 100,
                    sprite: 'sprite_sheet.png'
                }
            );

        callback = function (name) {
            console.info('New Animation: ' + name);
        };

        character.on('changedAnimation', callback);

        character.addAnimation(
                'walking.right',
                {
                    frame: { width: 130, height: 150 },
                    start: { x: 10, y: 20 },
                    columns: 3,
                    framecount: 4
                }
            );

        character.setAnimation('walking.right');

        var frame = character.getAnimation().getFrame();
        expect(frame.x).toEqual(10);
        expect(frame.y).toEqual(20);

        character.getAnimation().step();
        frame = character.getAnimation().getFrame();
        expect(frame.x).toEqual(140);
        expect(frame.y).toEqual(20);

        character.getAnimation().step();
        frame = character.getAnimation().getFrame();
        expect(frame.x).toEqual(270);
        expect(frame.y).toEqual(20);

        character.getAnimation().step();
        frame = character.getAnimation().getFrame();
        expect(frame.x).toEqual(10);
        expect(frame.y).toEqual(170);

        character.getAnimation().step();
        frame = character.getAnimation().getFrame();
        expect(frame.x).toEqual(10);
        expect(frame.y).toEqual(20);

    });


});