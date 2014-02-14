
    define('render.body')
        .as({

            render: function (body) {
                this.ctx.beginPath();

                this.ctx.arc(body.x, body.y, body.r*2, 0, this.pi2, false);
                this.ctx.closePath();

                this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
                this.ctx.fill();

                //console.log('drew circle to', body.x, body.y, 'with radius', body.r * 5);
            }

        }, function (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');

            window.ctx = this.ctx;

            this.pi2 = Math.PI*2;
        });
