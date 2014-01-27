
    /**
     *  Handles interval for repainting.
     */
    define('util.clock')
        .uses('util.evt')
        .as({           


            /**
             *  Trigger the tick event and
             *  reset the _flag property
             */
            _execute: function () {
                if (this._flag) {
                    this._flag = false;
                    this.trigger('tick');
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
                var that, args;
                
                if (!this._id) {
                    that = this;

                    that._id = setInterval(function() { 
                        that._execute(); 
                    }, delay);

                }

                args = _(arguments).toArray();
                args.shift();
                args.unshift('start');

                this.trigger.apply(this, args);
            },


            /**
             *  Stop the running interval.
             */
            stop: function () {
                clearInterval(this._id);
                delete this._id;
                this.trigger('stop');
            },
            

            /**
             *  Mark the next execution. The next time
             *  the interval invokes its callback, the
             *  tick-event gets triggered.
             *
             */
            mark: function () {
                this._flag = true;
            }

        }, function (delay, autostart) {
            var that = this;
        
            this._flag = false;
            this._delay = delay;

            // if 'start' gets triggered,
            // go into auto-loop mode
            this.on('go', function () {
                var args;

                if (that._id === undefined) {
                    args = _(arguments).toArray();
                    args.unshift(that._delay);
                    that.start.apply(that, args);

                    that.mark();
                    that.on('tick', _(that.mark).bind(that));
                }
            });

            // upon 'stop' events stop
            // the clocks loop completely
            this.on('halt', function () {
                if (that._id !== undefined) {
                    that.stop();
                }
            });

            if (autostart !== false) {
                this.start(delay);
            }
        });
