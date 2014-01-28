
    (function () {

        var storyline, exc;
        exc = _(norne.exc.raise).partial('story.storyline');

        /**
         *  The storyline encapsulates a list of twists
         *  that optimally work on the same property.
         */
        storyline = define('core.story.storyline')
            .as({

                /** 
                 *  The index function returns
                 *  the index on which the provided
                 *  pos must be inserted into the
                 *  list of twists while maintaining
                 *  the order over <key>.
                 *
                 *  @param pos Value of insertion
                 *  @type pos Number or Object
                 *  @param key Reference property of the twists
                 *  @type key String
                 */
                index: function (pos, key) {
                    var obj;

                    if (_(pos).isNumber()) {
                        (obj = {})[key] = pos;
                    }

                    return _(this.twists).sortedIndex((obj||pos), key);
                },


                /**
                 *  Add a twist to the current storyline. An opts
                 *  object must be provided, describing at least
                 *  the twists range (opts.start, opts.end) and
                 *  and the target values (opts.from, opts.to).
                 *
                 *  The provided callback gets called when the
                 *  value changes upon the worlds posChanged event.
                 *
                 *  @param opts Options object
                 *  @type opts Object
                 *  @param fn Callback function
                 *  @type fn Function
                 */
                addTwist: function (opts, fn) {
                    var index = this.index(opts, 'start');

                    if (this.twists[index]) { 
                        if (this.twists[index].start === opts.start) {
                            exc('Twists may not overlap (position '+ opts.start +')');
                        }
                    }

                    this.twists.splice(index, 0, _(fn).extend(opts));
                },


                /** 
                 *  This function determines the callback
                 *  value and if the callback must be called at all.
                 *
                 *  @param x Value to be mapped
                 *  @type x Number
                 */
                update: function (x) {
                    var index, twist, value;

                    if (this.twists.length === 0) {
                        return;
                    }

                    index = this.index(x, 'start') - 1;

                    if (index === -1 && x <= this.twists[0].start) {
                        twist = this.twists[0];
                        value = twist.from;
                    } else {
                        twist = this.twists[index];

                        if (x <= twist.end) {
                            value = (twist.end - twist.start)/(x - twist.start);
                            value = (twist.to - twist.from)/value;
                            value = twist.from + value;
                        }

                        value = value || twist.to;
                    }

                    if (value !== this._value) {
                        twist(value);
                        this._value = value;
                    }

                }

            }, function (name) {
                this.name = name;
                this.twists = [];
            });



        /** 
         *  The story hold different storylines
         *  that handle changes of attributes
         *  while the world moves.
         */
        define('core.story')
            .uses('util.evt')
            .as({

                /**
                 *  Adds a new storyline. Returns a
                 *  storyline object to configure.
                 *
                 *  @param name The storylines name
                 *  @type name String
                 */
                addStoryline: function (name) {
                    this.storylines[name] = storyline.create(name);
                    return this.storylines[name];
                },

                /**
                 *  This function normally gets called automatically
                 *  upon world position changes.
                 *
                 *  @param pos The world new position
                 *  @type pos Number
                 */
                callStorylines: function (pos) {
                    _(this.storylines).each(function (storyline) {
                        storyline.update(pos);
                    });
                }

            }, function (world) {

                this.storylines = {};
                world.on('posChanged', _(this.callStorylines).bind(this));

            });

    }());