norne.obj.define('exc', {

	toString: function () {
		return this.name;
	}

}, function (name, msg) {

	this.name = name;
	this.message = msg;

});