(function () {

	/*
	 *  called by norne
	 */
	function init(world) {
		console.log('init called');
	}


	$(function () {
		norne({
			canvas: $('#norne')
		}, init);
	});

}());