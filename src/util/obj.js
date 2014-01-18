
	(function () {
		var obj, slice;

		slice = Array.prototype.slice;

		/**
		 *	These are the factory objects encapsulating
		 *	the objects definition. They offer methods to
		 *	set a prototype, extend instances with an arbitrary
		 *	amount of base objects and describe the object and
		 *	its constructor.
		 */
		obj = {

			proto: {},
			extensions: [],

			/**
			 *	Set a prototype for instances of this object.
			 *
			 *	@param proto A prototype object
			 *	@type proto Object
			 */
			has: function (proto) {
				this.proto = proto;
				return this;
			},


			/**
			 *	Define a number of objects whose
			 *	properties will be copied to every instance
			 *	created by this factory.
			 *
			 *	@param arguments Base objects
			 *	@type arguments Object
			 */
			uses: function () {
				this.extensions = _(arguments).toArray();
				return this;
			},


			/**
			 *	Describe the object whose instances
			 *	will be created.
			 *
			 *	@param object Base object describing properties
			 *					and methods of object instances
			 *	@type object Object
			 *	@param constructor Constructor function. Gets called
			 *						everytime an instance gets created.
			 *						The constructors context is the
			 *						object instance.
			 *	@type constructor Function
			 */
			as: function (object, constructor) {
				if (_(object).isFunction()) {
					constructor = object;
					object = {};
				}

				this.base = _({}).extend(object);
				this.constr = constructor;
				return this;
			},
			

			/**
			 *	Returns an instance of the defined object.
			 */		 
			create: function () {
				var that = Object.create(this.proto);

				// copy extensions
				_(this.extensions).each(function (e) {
					if (_(e).isString()) {
						e = norne.obj.create(e);
					}
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


		/**
		 *	norne.obj interface to define object factories.
		 */
		norne.register('obj', {

			objs: {},

			exc: _({}).extend(norne.exception, {
				name: 'norne.obj'
			}),


			/**
			 *	Returns factory of the given name.
			 *
			 *	@param name Name of the factory definition.
			 *	@type name String
			 */
			get: function (name) {
				return this.objs[name];
			},


			/**
			 *	Defines a factory with the given name.
			 *
			 *	@param name Name of the factory definition.
			 *	@type name String
			 */
			define: function (name) {

				if (this.objs[name]) {
					norne.exc.raise(
						'norne.obj',
						'This definition already exists (' + name + ')'
					);
				}

				this.objs[name] = Object.create(obj);
				return this.objs[name];
			},


			/**
			 *	Deletes a factory with the given name.
			 *
			 *	@param name Name of the factory definition.
			 *	@type name String
			 */
			erase: function (name) {
				if (this.objs[name]) {
					return delete this.objs[name];	
				}
				return false;
			},


			/**
			 *	Create an object instance. The first parameter
			 *	must be the factories name. The remaining parameters
			 *	will be passed through to the constructor function.
			 *
			 *	@param name Name of the factory definition.
			 *	@type name String
			 */
			create: function(name) {
				var args, context;

				args = _(arguments).toArray();
				name = args.shift();
				context = this.objs[name];

				return context.create.apply(context, args);
			}
		});
	}());