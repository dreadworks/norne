
describe('util.color', function () {

    var create = _(norne.obj.create).bind(norne.obj);

    it('should be accessible', function () {
        var color;

        color = create('util.color');
        expect(color).toBeDefined();
    });


    it('should accept hex values', function () {
        var color, hex;

        hex = '#0099ff';
        color = create('util.color', hex);
        expect(color.hex()).toEqual(_(hex).rest(1).join(''));

        hex = '#ff9900';
        color = create('util.color');
        color.hex(hex);
        expect(color.hex()).toEqual(_(hex).rest(1).join(''));

        hex = '0099ff';
        color = create('util.color', hex);
        expect(color.hex()).toEqual(hex);

        hex = 'ff9900';
        color = create('util.color');
        color.hex(hex);
        expect(color.hex()).toEqual(hex);
    });


    it('should accept rgb values', function () {
        var color, r, g, b, rgb;

        r = 255;
        g = 122;
        b = 0;

        rgb = 'rgb('+r+','+g+','+b+')';
        color = create('util.color', rgb);

        expect(color.rgb()).toEqual(rgb);
        expect(color.red()).toEqual(r);
        expect(color.green()).toEqual(g);
        expect(color.blue()).toEqual(b);

        color.red(b);
        expect(color.red()).toEqual(b);

        color.green(r);
        expect(color.green()).toEqual(r);

        color.blue(g);
        expect(color.blue()).toEqual(g);

        expect(color.rgb()).toEqual('rgb('+b+','+r+','+g+')');

        color.rgb(r, g, b);
        expect(color.rgb()).toEqual(rgb);
    });


    it('handles falsy rgb values', function () {
        var color;

        color = create('util.color');
        expect(_(color.rgb).partial(256, 256, 256)).toThrow();

        expect(_(color.red).partial(256)).toThrow();
        expect(_(color.green).partial(256)).toThrow();
        expect(_(color.blue).partial(256)).toThrow();
    });


    it('should accept hsl values', function () {
        var color, h, s, l, hsl;

        h = 40;
        s = 50;
        l = 60;

        hsl = 'hsl('+ h +','+ s +'%,'+ l +'%)';
        color = create('util.color', hsl);

        expect(color.hsl()).toEqual(hsl);
        expect(color.hue()).toEqual(h);
        expect(color.saturation()).toEqual(s);
        expect(color.lightness()).toEqual(l);

        color.hue(s);
        expect(color.hue()).toEqual(s);

        color.saturation(l);
        expect(color.saturation()).toEqual(l);

        color.lightness(h);
        expect(color.lightness()).toEqual(h);

        expect(color.hsl()).toEqual('hsl('+ h +','+ s +'%,'+ l +'%)');

        color.hsl(h, s, l);
        expect(color.hsl()).toEqual(hsl);
    });


    it('normalizes hsl values', function () {
        var color;

        color = create('util.color', 'hsl(361, 20%, 10%)');
        expect(color.hsl()).toEqual('hsl(1, 20%, 10%');
    });


    it('handles falsy hsl values', function () {
        var color;

        color = create('util.color');
        expect(_(color.hsl).partial(30, 110, 0)).toThrow();

        expect(_(color.saturation).partial(140)).toThrow();
        expect(_(color.lightness).partial(150)).toThrow();
    });












});