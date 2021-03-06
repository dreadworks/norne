(function () {

var stub, def, erase;

def = _(norne.obj.define).bind(norne.obj);
create = _(norne.obj.create).bind(norne.obj);
erase = _(norne.obj.erase).bind(norne.obj);

describe('norne.evt', function () {

    beforeEach(function () {
        stub = {
            callback: function () {},
            anotherCallback: function () {}
        };

        spyOn(stub, 'callback');
        spyOn(stub, 'anotherCallback');
    });

    it('should be accessible', function () {
        expect(norne.on).toBeDefined();
        expect(norne.off).toBeDefined();
        expect(norne.trigger).toBeDefined();
    });


    it('lets me register callbacks', function () {
        expect(norne.on).toBeDefined();
        expect(norne.trigger).toBeDefined();

        norne.on('test', stub.callback);
        norne.trigger('test');
        expect(stub.callback).toHaveBeenCalled();
    });


    it('lets me deactivate the event', function () {
        expect(norne.off).toBeDefined();

        norne.on('test', stub.callback);
        norne.off('test');

        norne.trigger('test');
        expect(stub.callback).not.toHaveBeenCalled();
    });


    it('handles multiple callbacks', function () {
        norne.on('test', stub.callback);
        norne.on('test', stub.anotherCallback);

        norne.trigger('test');
        expect(stub.callback).toHaveBeenCalled();
        expect(stub.anotherCallback).toHaveBeenCalled();

        norne.off('test');
    });


    it('lets me remove particular callbacks', function () {
        norne.on('test', stub.callback);
        norne.on('test', stub.anotherCallback);

        norne.off('test', stub.anotherCallback);
        norne.trigger('test');

        expect(stub.callback).toHaveBeenCalled();
        expect(stub.anotherCallback).not.toHaveBeenCalled();

        norne.off('test');
    });


    it('should pass arguments over to the callback', function () {
        var a, b;

        a = 0;
        b = 1;

        norne.on('test', stub.callback);
        norne.trigger('test', a, b);
        expect(stub.callback).toHaveBeenCalledWith(a, b);
    });


    it('passes the correct context to the callbacks', function () {
        var context, stub;

        stub = {
            callback: function () {
                expect(this).toEqual(norne);
            }
        };

        spyOn(stub, 'callback');
        norne.on('test', stub.callback);

        norne.trigger('test');
        norne.off('test');

        expect(stub.callback).toHaveBeenCalled();
    });


    it('handles callbacks autonomous', function () {
        var evt1, evt2;

        evt1 = create('util.evt');
        evt2 = create('util.evt');

        evt1.on('test', stub.callback);
        evt2.on('test', stub.anotherCallback);

        evt1.trigger('test');
        expect(stub.callback).toHaveBeenCalled();
        expect(stub.anotherCallback).not.toHaveBeenCalled();
    });


    it('works with norne.obj.define', function () {
        var fac1, fac2, evt1, evt2, evt3;

        fac1 = def('evt1').uses('util.evt');
        fac2 = def('evt2').uses('util.evt');

        evt1 = fac1.create();
        evt2 = fac1.create();
        evt3 = fac2.create();

        evt1.on('test', stub.callback);
        evt2.on('test', stub.anotherCallback);
        evt3.on('test', stub.anotherCallback);

        evt1.trigger('test');
        expect(stub.callback).toHaveBeenCalled();
        expect(stub.anotherCallback).not.toHaveBeenCalled();

        erase('evt1');
        erase('evt2');
    });


    it('may be used with predefined event classes', function () {
        var x, evtfac, emitter;

        x = 3;
        evtfac = norne.obj
            .define('evt.module.evtname')
            .as(function (arg) {
                this.x = arg;
            });

        emitter = norne.obj
            .define('test')
            .uses('util.evt')
            .create();

        emitter.on('module.evtname', stub.callback);
        emitter.on('module.evtname', function (evt) {
            expect(evt.x).toEqual(x);
            expect(evt.module).toEqual('module');
            expect(evt.name).toEqual('evtname');
        });

        emitter.trigger('module.evtname', x);
        expect(stub.callback).toHaveBeenCalled();

        erase('test');
        erase('evt.module.evtname');
    });

});


describe('util.evt.proxy', function () {


    it('should be accessible', function () {
        x = create('util.evt.proxy');
    });


    it('listens on all events', function () {
        var proxy, stub;

        stub = { callback: function () {} };
        spyOn(stub, 'callback');

        def('emitter').uses(
            'util.evt'
        ).as({

            emit: function () {
                this.trigger('one');
                this.trigger('two', 'two');
            }

        });

        def('proxy').uses(
            'util.evt',
            'util.evt.proxy'
        ).as(function () {
            this.emitter = create('emitter');
            this.delegate(this.emitter);
        });

        proxy = create('proxy');

        proxy.on('one', stub.callback);
        proxy.on('two', stub.callback);

        proxy.emitter.emit();
        expect(stub.callback).toHaveBeenCalledWith(proxy.emitter);
        expect(stub.callback).toHaveBeenCalledWith(proxy.emitter, 'two');

        erase('emitter');

    });

});

}());

