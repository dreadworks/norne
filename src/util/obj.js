norne.register('obj', {

	objs: {},

	exc: _({}).extend(norne.exception, {
		name: 'norne.obj'
	}),


	define: function (name) {
		if (this.objs[name]) {
			throw _({}).extend({
				message: 'object with that name already exists'
			});
		}

		this.objs[name] = {};
		return this;
	},

	use: function () {
		return this;
	},

	extend: function () {
		return this;
	},

	as: function (props) {
		_(this).extend(props);
		return this;
	}

});