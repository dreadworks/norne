
    define('render.body')
        .as({

            render: function (body) {
                console.info('gonna render a body');
                console.dir(body);
            }

        }, function (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
        });
