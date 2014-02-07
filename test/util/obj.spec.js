describe('norne.obj', function () {

    var o, def, create;

    o = norne.obj;
    def = _(norne.obj.define).bind(norne.obj);
    create = _(norne.obj.create).bind(norne.obj);
    erase = _(norne.obj.erase).bind(norne.obj);


    it('is accessible', function () {
        expect(norne.obj).toBeDefined();
    });


    it('lets define and erase', function () {
        var obj;

        expect(norne.obj.define).toBeDefined();
        obj = def('test');
        expect(norne.obj.objs.test).toBeDefined();

        expect(norne.obj.erase).toBeDefined();
        erase('test');
        expect(norne.obj.objs.test).not.toBeDefined();
    });


    it('prevents overwrite attempts', function () {
        def('test');

        function catcher() {
            return def('test');
        }

        expect(catcher).toThrow();
        erase('test');
    });


    it('returns correct values when erasing', function () {
        def('test');

        expect(erase('test')).toBe(true);
        expect(erase('test')).toBe(false);
    });     


    it('can create', function () {
        var obj, base, inst1;
        expect(create).toBeDefined();

        base = { x: 'x' };
        obj = def('test').as(base);

        inst1 = obj.create();

        expect(inst1.x).toEqual(base.x);

        inst1.x = 'something else';
        expect(inst1.x).not.toEqual(base.x);

        erase('test');
    });


    it('lets recieve', function () {
        var obj;

        expect(norne.obj.get).toBeDefined();
        def('test');
        obj = norne.obj.get('test');

        expect(obj).toBeDefined();
        erase('test');
    });


    it('creates independent instances', function () {
        var obj, inst1, inst2;
        obj = def('test').as({
            x: 1
        });

        inst1 = obj.create();
        inst2 = obj.create();

        inst2.x = 2;

        expect(inst1.x).toEqual(1);
        expect(inst2.x).toEqual(2);

        erase('test');
    });


    it('uses the constructor function', function () {
        var obj, inst1, inst2;

        obj = def('test').as({
            x: 0
        }, function (x) {
            this.x = x;
        });

        inst1 = obj.create(1);
        inst2 = obj.create(2);

        expect(inst1.x).toEqual(1);
        expect(inst2.x).toEqual(2);

        erase('test');
    });


    it('can be invoked only with a constructor', function () {
        var obj;
        obj = def('test').as(function () {
            this.x = 3;
        });

        expect(obj.create().x).toEqual(3);
        erase('test');
    });


    it('constructor always returns the objects instance', function () {
        var obj, base, inst1;

        base = { x: 0 };
        obj = def('test').as(base, function () {
            return this.x;
        });

        inst1 = obj.create();
        expect(inst1.x).toEqual(base.x);

        inst1 = create('test');
        expect(inst1.x).toEqual(base.x);

        erase('test');
    });


    it('can be invoked globally', function () {
        var inst1;

        def('test').as({
            x: 0
        }, function (x) {
            this.x = x;
        });

        inst1 = create('test', 3);

        expect(inst1.x).toEqual(3);
        erase('test');
    });


    it('can be extended', function () {
        var obj, base;
        base = { x: 0 };

        obj = def('test').uses(
            base
        ).create();

        expect(obj.x).toEqual(0);
        base.x = 2;
        expect(obj.x).toEqual(0);

        erase('test');
    });


    it('can be extended by other norne.obj definitions', function () {
        var obj, base;

        base = { x: 1 };
        def('base').as(base);
        def('test').uses('base');

        obj = create('test');
        expect(obj.x).toEqual(base.x);

        erase('base');
        erase('test');
    });


    it('may define a prototype', function () {
        var proto1, obj, inst1, inst2;

        proto1 = { proto1: 1 };

        obj = def('test').has(
            proto1
        );

        inst1 = obj.create();
        inst2 = obj.create();

        expect(inst1.proto1).toEqual(proto1.proto1);
        expect(inst2.proto1).toEqual(proto1.proto1);

        proto1.proto1 = 42;
        expect(inst1.proto1).toEqual(proto1.proto1);
        expect(inst2.proto1).toEqual(proto1.proto1);

        erase('test');
    });


    it('lets me call super constructors', function () {
        var parent, child;

        parent = def('test').as(function (x) {
            this.x = x;
        }).create(5);

        child = def('testchildren')
            .uses('test')
            .create(3);

        expect(child.x).toEqual(3);
        expect(parent.x).toEqual(5);

        erase('test');
        erase('testchildren');
    });


    it('calls and removes _construct', function () {
        var obj;

        norne.obj.define('test')
            .as({
                _construct: function (name) {
                    this.name = name;
                }
            });

        norne.obj.define('something')
            .uses('test');

        obj = norne.obj.create('something');
        expect(obj.name).toEqual('something');
        expect(obj._construct).not.toBeDefined();

        norne.obj.erase('test');
        norne.obj.erase('something');
    });

});




