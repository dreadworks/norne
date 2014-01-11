(function () {

	var obj, slice;

	slice = Array.prototype.slice;

	obj = {

		proto: {},
		extensions: [],

		has: function (proto) {
			this.proto = proto;
			return this;
		},

		uses: function () {
			var that = this;
		
			_(arguments).each(function (arg) {
				if (_(arg).isString()) {
					arg = norne.obj.create(arg);
				}

				that.extensions.push(arg);
			});
			return this;
		},

		as: function (object, constructor) {
			this.base = _({}).extend(object);
			this.constr = constructor;
			return this;
		},

		create: function () {
			var that = Object.create(this.proto);

			// copy extensions
			_(this.extensions).each(function (e) {
				_(that).extend(e);
			});

			// extend with base object
			_(that).extend(this.base);

			// call constructor function
			if (this.constr) {
				this.constr.apply(that, arguments);
			}

			return that;
		}

	};


	norne.register('obj', {

		objs: {},

		exc: _({}).extend(norne.exception, {
			name: 'norne.obj'
		}),


		get: function (name) {
			return this.objs[name];
		},


		define: function (name) {

			if (this.objs[name]) {
				throw _({}).extend({
					message: 'object with that name already exists'
				});
			}

			this.objs[name] = Object.create(obj);
			return this.objs[name];
		},


		erase: function (name) {
			if (!this.objs[name]) {
				throw _({}).extend({
					message: 'object with that name does not exist'
				});
			}
			delete this.objs[name];
		},


		create: function() {
			var args, name, context;

			args = Array.prototype.slice.call(arguments);
			name = args.shift();
			context = this.objs[name];

			return context.create.apply(context, args);
		}

	});

}());
