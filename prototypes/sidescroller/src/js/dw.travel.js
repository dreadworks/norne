/*
 *	the travel plugin (2010)
 */
 
//	storage
jQuery.travel = new Object;
(function(t) {
	/*
	 *		central configuration
	 *			parameters:
	 *				o (object): configurational directives
	 *
	 */
	jQuery.fn.travel = function(o) {
		
		/*
		 *		default options and used when
		 *		not specified otherwise
		 */
		var defaults = {
			
			container:	jQuery(window),		// the scrollable element
			reference:	false,				// object which represents the total width
			step_size:	1,					// height or width of the offset 
											// this offset has to be scrolled until items are moved
			move_type:	"direct",			// the movement type - "direct" or "indirect"
			move_speed: 500,				// animation speed if type == indirect
			
			//	application internals
			step_current: 			undefined,		// where the user has currently scrolled to
			time_last: 				undefined,		// to determine the gap between two steps
			container_width:		undefined,		// total width of scrolling element
			container_rwidth:		undefined		// total width of referencing element

			
		}
		
		t = jQuery.extend(defaults, o);
		jQuery().travel.core.init();
		
	};
	
	
	
	/*
	 *		core functionality
	 *
	 */
	jQuery.fn.travel.core = {
		
		/*
		 *		initialize
		 */
		init: function() {
			
			// set values
			t.step_current = this.evaluate("step", t.container.scrollLeft() );
			t.container_width = t.container.width();
			t.container_rwidth = t.reference.width();
			jQuery(t.objects).each( function(l,o) {
				
				( function(layer) {
					o.each( function(i,o) {
						obj = jQuery(o);
						obj[0].jQueryTravel = new Object;
						obj[0].jQueryTravel.position = obj.position().left;
						obj[0].jQueryTravel.layer = layer+1;
					});
				}) (l);
				
			});

			// init listener
			t.container.scroll( jQuery.proxy( function() {
			
				var step = this.evaluate("step", t.container.scrollLeft() );
				if (t.step_current != step) {
					
					t.step_last = t.step_current;
					t.step_current = step;
					
					jQuery(t.objects).each( jQuery.proxy( function(i,o) {
						o.each( jQuery.proxy( function(i,o) {
							var newPos = this.evaluate("newPosition", jQuery(o));
							jQuery().travel.core.move(o, newPos);
						}, this));
						
					}, this ));
					
				}
					
			}, this));
			
		},


		/*
		 *		animate
		 *
		 *			parameters
		 *				o (dom): object to be animated
		 *				p (number): new position
		 */
		move: function(o, p) {
			
			switch (t.move_type) {
				case "direct":
					jQuery(o).css("left",p+"px"); break;
				case "indirect":
					o.stop(false, false);
					o.animate({ left: p+"+x" }, t.move_speed); break;
			}		
			
		},


		/*
		 *		evaluate
		 *
		 *			parameters
		 *				k (string): kind of evaluation
		 *				i: whatever shall be evaluated
		 */
		evaluate: function(k,i) {
			var v;
			switch (k) {
				
				case "step": 
					v = Math.ceil( i/t.step_size ); 
					break;
				
				case "newPosition":
					v = (i[0].jQueryTravel.position-(t.step_current*t.step_size) / i[0].jQueryTravel.layer);
					break;
				
			}	
			return v;
		}
		
	};	//end of travel.core
	
}) (jQuery.travel);
	