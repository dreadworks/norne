describe('norne.obj', function () {

    var o, def, create;

    o = norne.obj;
    define = _(norne.obj.define).bind(norne.obj);
    create = _(norne.obj.create).bind(norne.obj);
    erase = _(norne.obj.erase).bind(norne.obj);
    mixin = _(norne.obj.mixin).bind(norne.obj);


    it('is accessible', function () {
        expect(norne.obj).toBeDefined();
    });


    it('lets define and erase', function () {
        var obj;

        expect(norne.obj.define).toBeDefined();
        obj = define('test');
        expect(norne.obj.objs.test).toBeDefined();

        expect(norne.obj.erase).toBeDefined();
        erase('test');
        expect(norne.obj.objs.test).not.toBeDefined();
    });


    it('prevents overwrite attempts', function () {
        define('test');

        function catcher() {
            return define('test');
        }

        expect(catcher).toThrow();
        erase('test');
    });


    it('returns correct values when erasing', function () {
        define('test');

        expect(erase('test')).toBe(true);
        expect(erase('test')).toBe(false);
    });     


    it('can create', function () {
        var obj, base, inst1;
        expect(create).toBeDefined();

        base = { x: 'x' };
        obj = define('test').as(base);

        inst1 = obj.create();

        expect(inst1.x).toEqual(base.x);

        inst1.x = 'something else';
        expect(inst1.x).not.toEqual(base.x);

        erase('test');
    });


    it('lets recieve', function () {
        var obj;

        expect(norne.obj.get).toBeDefined();
        define('test');
        obj = norne.obj.get('test');

        expect(obj).toBeDefined();
        erase('test');
    });


    it('creates independent instances', function () {
        var obj, inst1, inst2;
        obj = define('test').as({
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

        obj = define('test').as({
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
        obj = define('test').as(function () {
            this.x = 3;
        });

        expect(obj.create().x).toEqual(3);
        erase('test');
    });


    it('constructor always returns the objects instance', function () {
        var obj, base, inst1;

        base = { x: 0 };
        obj = define('test').as(base, function () {
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

        define('test').as({
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

        obj = define('test').uses(
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
        define('base').as(base);
        define('test').uses('base');

        obj = create('test');
        expect(obj.x).toEqual(base.x);

        erase('base');
        erase('test');
    });


    it('may define a prototype', function () {
        var proto1, obj, inst1, inst2;

        proto1 = { proto1: 1 };

        obj = define('test').has(
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

        parent = define('test').as(function (x) {
            this.x = x;
        }).create(5);

        child = define('testchildren')
            .uses('test')
            .create(3);

        expect(child.x).toEqual(3);
        expect(parent.x).toEqual(5);

        erase('test');
        erase('testchildren');
    });


    it('calls and removes _construct', function () {
        var obj;

        define('test')
            .as({
                _construct: function (name) {
                    this.name = name;
                }
            });

        define('something')
            .uses('test');

        obj = create('something');
        expect(obj.name).toEqual('something');
        expect(obj._construct).not.toBeDefined();

        erase('test');
        erase('something');
    });


    it('prevents circular dependencies', function () {
        var obj;

        define('parent').uses('child');
        define('child').uses('parent');

        obj = create('child');
        expect(obj).toBeDefined();

        erase('parent');
        erase('child');
    });


    it('lets me mixin objects', function () {
        var aggregate;

        define('one').as({ one: 1 });
        define('two').as({ two: 2 });

        aggregate = mixin('one', 'two', { three: 3 }, [{four: 4}, { five: 5}]);

        expect(aggregate.one).toBeDefined();
        expect(aggregate.two).toBeDefined();
        expect(aggregate.three).toBeDefined();
        expect(aggregate.four).toBeDefined();
        expect(aggregate.five).toBeDefined();

        erase('one');
        erase('two');
    });

});




