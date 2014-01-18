
	norne.obj
		.define('core.norne')
		.as({

			setRenderer: function (renderer) {
				this.renderer = norne.obj.create(renderer, this.world);
			}

		}, function (opts) {

			var defaults = {
				depth: 100,
				canvas: document.body
			};

			opts = _(defaults).extend(opts);
			this.world = norne.world(opts.depth);

		});