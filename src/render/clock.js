
    /**
     *  Handles interval for repainting.
     */
    define('render.clock')
        .uses('util.evt')
        .as({           


            /**
             *  Trigger the tick event and
             *  reset the _flag property
             */
            _execute: function () {
                if (this._flag) {
                    this.trigger('tick');
                    this._flag = false;
                }
            },


            /**
             *  Start the interval. You must
             *  call .stop() before you can start
             *  a new interval.
             *
             *  @param delay The intervals delay
             *  @type delay Number
             */
            start: function (delay) {
                var that;
                if (!this._id) {
                    that = this;

                    that._id = setInterval(function() { 
                        that._execute(); 
                    }, delay);

                }
            },


            /**
             *  Stop the running interval.
             */
            stop: function () {
                clearInterval(this._id);
                delete this._id;
            },

            /**
             *  Mark the next execution. The next time
             *  the interval invokes its callback, the
             *  tick-event gets triggered.
             *
             */
            mark: function () {
                this._flag = true;
            },

        }, function (delay) {
            this._flag = false;
            this.start(delay);
        });
