
    /**
     *  Implemented after http://www.w3.org/TR/css3-color/#colorunits
     */
     define('util.color')
         .uses('util.exc')
         .as({

            pattern: {
                hex: /^#?([\da-f]{6})|([\da-f]{3})$/i,
                hsl: /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d(?:.\d+)))?\)$/,
                rgb: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
            },


            // switch to rgb mode, convert
            // from hsl if necessary
            _rgbmode: function () {
                if (this.c.sys === 'hsl') {
                    this.conv.hsl2rgb(
                        this.c.h, this.c.s, this.c.l,
                        this.c
                    );
                }
                this.c.sys = 'rgb';
            },


            // switch to hsl mode, convert
            // from rgb if necessary
            _hslmode: function () {
                if (this.c.sys === 'rgb') {
                    this.conv.rgb2hsl(
                        this.c.r, this.c.g, this.c.b,
                        this.c
                    );
                }
                this.c.sys = 'hsl';
            },


            /**
             *  Different converter methods.
             *  Mostly work on color objects
             *  holding r, g, b or h, s, l
             *  properties (this.c).
             */
            conv: {

                /**
                 *  Normalizes an arbitrary hue value
                 *  to x is x mod 360.
                 */
                hue: function (x) {
                    return (((x % 360) + 360) % 360);
                },


                /**
                 *  Takes a color object c
                 *  and returns a 32 bit integer
                 *  containing all three channels.
                 */
                rgb2hex: function (c) {
                    return (c.r << 0xf0) +
                           (c.g << 0x8) +
                           c.b;
                },


                /**
                 *  Takes a 32 bit integer rgb code
                 *  and extracts the different color
                 *  channels. Saves the result to c.
                 *
                 *  @param code Color code
                 *  @type code Number
                 *
                 */
                hex2rgb: function (code, c) {
                    c = c || {};

                    c.r = code >> 0xf0 & 0xff;
                    c.g = code >> 0x08 & 0xff;
                    c.b = code & 0xff;

                    c.sys = 'rgb';
                    return c;
                },


                /**
                 *  Converts hsl values to rgb.
                 *  The result gets saved in c.
                 *  
                 *  Implemented after
                 *  http://www.w3.org/TR/css3-color/#hsl-color
                 *
                 *  @param h Hue value
                 *  @type h Number (0 <= h <= 360)
                 *  @param s Saturation value
                 *  @type s Number (0 <= s <= 100)
                 *  @param l Lightness value
                 *  @type l Number (0 <= l <= 100)
                 */
                hsl2rgb: function (h, s, l, c) {
                    var m1, m2;

                    function conv(m1, m2, h) {
                        h = (h<0) ? h+1 : h;
                        h = (h>1) ? h-1 : h;

                        if (h*6 < 1) { return m1+(m2-m1)*h*6; }
                        if (h*2 < 1) { return m2; }
                        if (h*3 < 2) { return m1+(m2-m1)*(2/3-h)*6; }

                        return m1;
                    }

                    c = c || {};

                    h /= 360;
                    s /= 100;
                    l /= 100;

                    m2 = (l <= 0.5) ? l*(s+1) : l+s-l*s;
                    m1 = l*2-m2;

                    c.r = Math.round(conv(m1, m2, h+1/3) * 255);
                    c.g = Math.round(conv(m1, m2, h) * 255);
                    c.b = Math.round(conv(m1, m2, h-1/3) * 255);

                    c.sys = 'rgb';
                    return c;
                },


                /**
                 *  Converts rgb values to hsl.
                 *  The result gets saved in c.
                 *
                 *  Implemented after:
                 *  http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
                 *
                 *  @
                 *
                 */
                rgb2hsl: function (r, g, b, c) {
                    var max, min, d;
                    c = c || {};

                    r /= 255;
                    g /= 255;
                    b /= 255;

                    max = Math.max(r, g, b);
                    min = Math.min(r, g, b);

                    c.l = (max+min)/2;

                    if (max === min) {
                        c.h = c.s = 0;
                    } else {

                        d = max-min;
                        c.s = (c.l>0.5) ? d/(2-max-min) : d/(max+min);

                        switch (max) {
                            case r: c.h = (g-b)/d+ ((g<b) ? 6 : 0); break;
                            case g: c.h = (b-r)/d+2; break;
                            case b: c.h = (r-g)/d+4; break;
                        }

                        c.h /= 6;
                        c.h = Math.round(c.h*360);
                    }

                    c.s = Math.round(c.s*100);
                    c.l = Math.round(c.l*100);

                    c.sys = 'hsl';
                    return c;
                }
            },


            /**
             *  Checks if the provided values
             *  are in the correct range per
             *  color system.
             */
            is: {

                rgb: function (x) {
                    return (
                        x>>0xf0 < 256 &&
                        (x>>0x8 & 0xff) < 256 &&
                        (x & 0xff) < 256
                    );
                },

                hsl: function (h, s, l) {
                    return _(h).isNumber() &&
                           0 <= s && s <= 100 &&
                           0 <= l && l <= 100;
                }

            },


            /**
             *  Set the color defined as a hexadecimal
             *  value. The provided color code may or
             *  may not start with #.
             *
             *  @param code Hexadecimal color code
             *  @type code String or Number
             */
             hex: function (code) {

                if (code === undefined) {
                    this._rgbmode();
                    code = this.conv.rgb2hex(this.c);
                    code = code.toString(16);
                    return '000000'.slice(code.length) + code;
                }

                if (_(code).isString()) {
                    code = this.pattern.hex.exec(code);
                    code = parseInt(code[1], 16);
                }

                if (this.is.rgb(code)) {
                    this.conv.hex2rgb(code, this.c);
                    return this;
                }

                this.raise('hex: Unexpected parameter '+ code);
             },


            /**
             *  Set the color defined as rgb color
             *  components.
             *
             *  @param r Red color component
             *  @type r Number
             *  @param g Green color component
             *  @type g Number
             *  @param b Blue color component
             *  @type b Number
             */
            rgb: function (r, g, b) {
                var rgb;

                rgb = _([r,g,b]);
                this._rgbmode();

                if (rgb.every(_.isUndefined)) {
                    return 'rgb('+ 
                        this.c.r +','+ 
                        this.c.g +','+ 
                        this.c.b +')';
                }

                if (rgb.every(function (x) {
                    return x < 256;
                })) {
                    this.c.r = r;
                    this.c.g = g;
                    this.c.b = b;
                    this.c.sys = 'rgb';
                    return this;
                }

                this.raise('rgb: Unexpected parameter '+ r +', '+ g +', '+ b);
            },


            // helper function as a shortcut 
            // for red(), green() and blue()
            _rgbc: function (t, c) {
                if (c === undefined) {
                    this._rgbmode();
                    return this.c[t];
                }

                if (c < 256) {
                    this._rgbmode();
                    this.c[t] = c;
                    return this;
                }

                this.raise('Unexpected parameter ' + r);
            },


            /**
             *  Set the red color component.
             *
             *  @param r Red color component.
             *  @type r Number
             */
            red: function (r) {
                return this._rgbc('r', r);                
            },


            /**
             *  Set the green color component.
             *
             *  @param r Green color component.
             *  @type r Number
             */
            green: function (g) {
                return this._rgbc('g', g);                
            },


            /**
             *  Set the blue color component.
             *
             *  @param r Blue color component.
             *  @type r Number
             */
            blue: function (b) {
                return this._rgbc('b', b);                
            },


            /**
             *  Sets the color as hsl color
             *  components.
             *
             *  @param h Hue value
             *  @type h Number
             *  @param s Saturation percentage
             *  @type s Number (0 <= x <= 100)
             *  @param l Lightness percentage
             *  @type l Number (0 <= x <= 100)
             */
            hsl: function (h, s, l) {
                var hsl;

                hsl = _([h, s, l]);
                this._hslmode();

                if (hsl.every(_.isUndefined)) {
                    return 'hsl('+ 
                        this.c.h +','+ 
                        this.c.s +'%,'+ 
                        this.c.l +'%)';
                }

                if (this.is.hsl(h, s, l)) {
                    this.c.h = this.conv.hue(h);
                    this.c.s = s;
                    this.c.l = l;
                    this.c.sys = 'hsl';
                    return this;
                }

                this.raise('hsl: Unexpected parameter '+ h +', '+ s +', '+ l);
            },


            /**
             *  Sets the colors hue component.
             *
             *  @param h Hue component
             *  @type h Number
             */
            hue: function (h) {
                if (h === undefined) {
                    this._hslmode();
                    return this.c.h;
                }

                if (_(h).isNumber()) {
                    this._hslmode();
                    this.c.h = this.conv.hue(h);
                    return this;
                }

                this.raise('hue: Unexpected parameter '+ h);
            },


            /**
             *  Sets the colors saturation.
             *
             *  @param s Saturation
             *  @type s Number
             */
            saturation: function (s) {
                if (s === undefined) {
                    this._hslmode();
                    return this.c.s;
                }

                if (0 <= s && s <= 100) {
                    this._hslmode();
                    this.c.s = s;
                    return this;
                }

                this.raise('saturation: Unexpected parameter '+ s);
            },


            /**
             *  Sets the colors lightness.
             *
             *  @param l Lightness
             *  @type l Number
             */
            lightness: function (l) {
                if (l === undefined) {
                    this._hslmode();
                    return this.c.l;
                }

                if (0 <= l && l <= 100) {
                    this._hslmode();
                    this.c.l = l;
                    return this;
                }

                this.raise('lightness: Unexpected parameter '+ l);
            },


            /**
             *  Sets the color. Currently supported
             *  formats:
             *    rgb(r, g, b)
             *    hsl(h, s%, l%)
             *    hexadecimal values
             *
             *  @param color Formatted color value
             *  @type color String
             */
            set: function (color) {
                var that, flag;

                that = this;
                flag = false;

                _(this.pattern).each(function (pat, type) {
                    if (pat.test(color)) {
                        color = pat.exec(color);
                        color.shift();

                        that[type].apply(that, _(color).map(function (c) {
                            return parseInt(c, (type==='hex') ? 16:10);
                        }));

                        flag = true;
                    }
                });

                if (color !== undefined && !flag) {
                    this.raise('set: Unexpected parameter '+ color);
                }

                return this;
            },


            // UTILITY FUNCTIONS
            /**
             *  Returns a clone of this
             *  color object instance.
             */
            clone: function () {
                var clone = create('util.color');
                clone.c = _({}).extend(this.c);
                return clone;
            },

            /**
             *  Returns the colors hex code
             *  as its String representation.
             */
            toString: function () {
                return this.hex();
            },


            /**
             *  Darken the color. If the
             *  lightness value would fall under
             *  zero, it remains zero.
             *
             *  @param amount Percentage
             *  @type amount Number
             */
            darken: function (amount) {
                var lightness;
                this._hslmode();

                lightness = this.c.l - amount;
                this.c.l = (lightness < 0) ? 0 : lightness;
            },


            /**
             *  Lighten the color. If the
             *  lightness value would go over
             *  100, it stays 100.
             *
             *  @param amount Percentage
             *  @type amount Number
             */
            lighten: function (amount) {
                var lightness;
                this._hslmode();

                lightness = this.c.l + amount;
                this.c.l = (lightness > 100) ? 100 : lightness;
            }


        }, function (color) {
            this.c = {};
            this.set(color);
        });
