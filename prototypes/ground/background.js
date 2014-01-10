



$(function () {

    var $canvas, canvas, segment, point;


    /*
     * Main
     */
    (function ($) {


        paper.setup('viewport');

        var path = new paper.Path();
        path.fillColor = '#dddddd';
        path.strokeCap = 'round';
        path.fullySelected = true;
        path.add(new paper.Point(0, 200)); 
        path.add(new paper.Point(0, 305)); 
        path.add(new paper.Point(705, 305));
        path.add(new paper.Point(705, 200));
        path.closed = true;

        path.onMouseDown = function(event) {
            if (point) {
                point.selected = false;
            }
            if (!segment) {
                var loc = path.getNearestLocation(event.point);
                var dist = event.point.getDistance(loc.segment.point);
                if (dist < 7) {
                    segment = loc.segment;    
                }
            }
        }

        path.onMouseUp = function(event) {
            segment = null;
        }

        path.onClick = function(event) {
            var loc = loc = path.getNearestLocation(event.point);
            if (loc._distance < 7) {
                point = new paper.Point(loc.point);
                point.selected = true;
                path.insert(loc.index+1, point);
                point = path.segments[loc.index].point;
            }
        }

        path.onMouseDrag = function(event) {
            if (segment) {
                segment.point = event.point;
                path.smooth();
            }
        }

        path.onKeyUp = function(event) {
            // TODO
        }


        paper.view.draw();

    }(jQuery));

});