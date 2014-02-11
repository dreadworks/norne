
describe('util.color', function () {

    var create = _(norne.obj.create).bind(norne.obj);

    it('should be accessible', function () {
        var color;

        color = create('util.color');
        expect(color).toBeDefined();
    });


    it('should accept hex values', function () {
        var color, hex;

        hex = '#1199ff';
        color = create('util.color', hex);
        expect(color.hex()).toEqual(_(hex).rest(1).join(''));

        hex = '#ff9911';
        color = create('util.color');
        color.set(hex);
        expect(color.hex()).toEqual(_(hex).rest(1).join(''));

        hex = '0099FF';
        color = create('util.color', hex);
        expect(color.hex()).toEqual(hex.toLowerCase());

        hex = 'FF9900';
        color = create('util.color');
        color.set(hex);
        expect(color.hex()).toEqual(hex.toLowerCase());
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

        expect(color.hsl()).toEqual('hsl('+ s +','+ l +'%,'+ h +'%)');

        color.hsl(h, s, l);
        expect(color.hsl()).toEqual(hsl);
    });


    it('normalizes hsl values', function () {
        var color;

        color = create('util.color', 'hsl(361, 20%, 10%)');
        expect(color.hsl()).toEqual('hsl(1,20%,10%)');
    });


    it('handles falsy hsl values', function () {
        var color;

        color = create('util.color');
        expect(_(color.hsl).partial(30, 110, 0)).toThrow();

        expect(_(color.saturation).partial(140)).toThrow();
        expect(_(color.lightness).partial(150)).toThrow();
    });


    it('converts from rgb to hsl', function () {
        var color, rgb, hsl;

        rgb = 'rgb(146,78,191)';
        hsl = 'hsl(276,47%,53%)';

        color = create('util.color').set(rgb);
        expect(color.hsl()).toEqual(hsl);
    });


    it('converts from hsl to rgb', function () {
        var color, rgb, hsl;

        hsl = 'hsl(42,27%,55%)';
        rgb = 'rgb(171,153,109)';

        color = create('util.color').set(hsl);
        expect(color.rgb()).toEqual(rgb);
    });


    it('lets me darken the color', function () {
        var color, hsl;

        hsl = 'hsl(240,100%,50%)';
        color = create('util.color').set(hsl);

        color.darken(20);
        expect(color.lightness()).toEqual(30);

        color.darken(100);
        expect(color.lightness()).toEqual(0);
    });


    it('lets me lighten the color', function () {
        var color, hsl;

        hsl = 'hsl(240,100%,50%)';
        color = create('util.color').set(hsl);

        color.lighten(1);
        expect(color.lightness()).toEqual(51);

        color.lighten(100);
        expect(color.lightness()).toEqual(100);
    });


    it('lets me clone', function () {
        var red, green;

        red = create('util.color').set('#ff0000');

        green = red.clone();
        green.red(0).green(255);

        expect(red.hex()).toEqual('ff0000');
        expect(green.hex()).toEqual('00ff00');
    });


    it('has a string representation', function () {
        var color;

        color = create('util.color').set('#efefef');
        expect(color.toString()).toEqual('rgb(239,239,239)');

        color.saturation(0);
        color.lightness(0);

        expect(color.toString()).toEqual('hsl(0,0%,0%)');
    });

});