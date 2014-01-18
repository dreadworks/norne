
	norne.obj
		.define('core.env')
		.as({

			setRenderer: function (name, canvas) {
				if (!_(canvas).isElement()) {
					norne.exc.raise(
						'norne',
						'setRenderer: no canvas provided'
					);
				}

				this.renderer = norne.obj.create(name, this.world);
			}

		}, function (opts) {

			var defaults = {
				depth: 100
			};

			opts = _(defaults).extend(opts);
			this.world = norne.world(opts.depth);

		});