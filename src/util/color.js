
    /**
     *  Implemented after http://www.w3.org/TR/css3-color/#colorunits
     */
    define('util.color')
        .uses('util.exc')
        .as({

            is: {
                rgb: function (x) {
                    return (
                        x>>>0xf0 < 256 &&
                        (x>>>0x8 & 0xff) < 256 &&
                        (x & 0xff) < 256
                    );
                }
            },

            conv: {

                degree: function (x) {
                    return (((x % 360) + 360) % 360);
                },

                percentage: function (p) {
                    return p/100;
                },

                hex: function (a, b, c) {
                    a <<= 0xf;
                    b <<= 0x8;

                }

            },

            pattern: {
                hex: /^#?([\da-f]{6})|([\da-f]{3})$/,
                hsl: /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d(?:.\d+)))?\)$/,
                rgb: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
            },


            hex: function (code) {
                console.info('hex called with', _(arguments).toArray().join(', '));

                if (code === undefined) {
                    code = this._rgb.toString(16);
                    return '000000'.slice(code.length) + code;
                }

                if (_(code).isString()) {
                    code = this.pattern.hex.exec(code);
                    code = parseInt(code[1], 16);
                }

                if (this.is.rgb(code)) {
                    this._h = this._sl = undefined;
                    this._rgb = code;
                    return;
                }

                this.raise('hex: Unexpected parameter '+ code);
            },


            hue: function (h) {

            },


            saturation: function (s) {

            },


            lightness: function (l) {

            },


            hsl: function (h, s, l) {
                console.info('hsl called with', _(arguments).toArray().join(', '));
            },


            red: function (r) {
                if (r === undefined) {
                    return this._rgb >>> 0xf0;
                }

                if (0 <= r && r < 256) {
                    this._rgb = (r << 0xf0) + (this._rgb & 0xffff);
                    return;
                }

                this.raise('red: Value not in range '+ r);
            },


            green: function (g) {
                if (g === undefined) {
                    return this._rgb >>> 0x8 & 0xff;
                }

                if (0 <= g && g < 256) {
                    this._rgb = (g << 0x8) + (this._rgb & 0xff00ff);
                    return;
                }

                this.raise('green: Value not in range: '+ g);
            },


            blue: function (b) {
                if (b === undefined) {
                    return this._rgb & 0xff;
                }

                if (0 <= b && b < 256) {
                    this._rgb = b + (this._rgb & 0xffff00);
                    return;
                }

                this.raise('blue: Value not in range: '+ b); 
            },


            rgb: function (r, g, b) {
                console.info('rgb called with ', _(arguments).toArray().join(', '));
                if (_([r,g,b]).every(_.isUndefined)) {
                    return 'rgb('+ 
                        this.red() +','+ 
                        this.green() +','+ 
                        this.blue() +')';
                }

                if (_([r,g,b]).every(_.isFinite)) {
                    return this.hex((r<<0xf) + (g<<0x8)  + b);
                }


            },


            set: function (color) {
                var that = this;

                _(this.pattern).each(function (pat, type) {
                    if (pat.test(color)) {
                        console.info(type, 'matched');

                        color = pat.exec(color);
                        color.shift();

                        that[type].apply(that, _(color).map(function (c) {
                            return parseInt(c, (type==='hex') ? 16:10);
                        }));
                    }
                });
            }

        }, function (color) {
            this.set(color);
        });