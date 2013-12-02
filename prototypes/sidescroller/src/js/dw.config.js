
jQuery(document).ready( function(e) {
	jQuery(window).travel({
		step_size: 1,
		reference: jQuery("#container"),
		move_type: "direct",
		
		objects: [ jQuery(".l1"), jQuery(".l2"), jQuery(".l3") ]
	});
});