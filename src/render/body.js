
    define('render.body')
        .as({

            render: function (proxy) {
                var that = this;
                console.log('render.body.render', proxy);
                this.draw(proxy);
            }

        });


    define('render.body.color.solid')
        .as({

            fill: function (proxy) {
                this.ctx.fillStyle = proxy.color;
                this.ctx.fill();
            },


            setColor: function (proxy, color) {
                proxy.color = color.toString();
            }

        });


    define('render.body.shape.round')
        .as({

            pi2: Math.PI*2,

            draw: function (proxy) {
                var that = this;

                _(proxy.particles).each(function (particle) {
                    that.ctx.beginPath();

                    that.ctx.arc(
                        particle.x, particle.y, particle.r*2, 
                        0, that.pi2, false
                    );

                    that.ctx.closePath();
                    that.fill(proxy);
                });
            }

        });
