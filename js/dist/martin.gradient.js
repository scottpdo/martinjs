// Gradients.
// {
//	0: '#000'
//  25: '#000',
//  100: '#fff',
//	angle: 45
// }
Martin.extend({
    setOriginalData: function() {

        this.layers[this.currentLayer].originalData =
            this.context.getImageData( 0, 0, this.width(), this.height() );

    },
    gradient: function( obj ) {

    	// angle += 90 because we refer to the perpendicular to the line
    	// formed by the original angle to determine our gradient
    	var angle = obj.angle ? obj.angle + 90 : 90,
    		radians = Martin.degToRad(angle),
    		start = obj.start ? obj.start : 0,
    		end = obj.end ? obj.end : 100,
    		slope = Math.tan(radians);

    	if ( end <= start ) {
    		throw new Error('End must be greater than start.');
    	}

    	// given a number 0-100, map to 0-1
    	start = start / 100;
    	end = end / 100;

    	// if the absolute value of the slope is very very high (that is, a vertical line)
    	// set it to false and check against this later
    	if ( Math.abs(slope) > 10000 ) slope = false;

    	// TODO: this but for angle
    	var center = {
    			x: start * this.canvas.width + 0.5 * ( end - start ) * this.canvas.width,
    			y: Math.floor(this.canvas.height / 2)
    		},
    		yInt = Math.round(-slope * center.x + center.y),
    		perpDistance = function(x, y) {

    			var c, dis;

    			// special case for 0 deg
    			if ( slope === 0 ) {

    				dis = Math.abs(center.y - y);

    			// special case for 90 deg
    			} else if ( !slope ) {

    				dis = Math.abs(center.x - x);

    			} else {

    				c = ( x + slope * y - slope * yInt  ) / ( slope * slope + 1);
    				dis = ( c - x ) * ( c - x ) + ( slope * c + yInt - y ) * ( slope * c + yInt - y );
    				dis = Math.sqrt(dis);
    			}

    			// is it at the start (positive) or end (negative) of the gradient
    			if ( rotate(x, y).x < 0 ) {
    				dis *= -1;
    			}

    			return dis;
    		},
    		rotate = function(x, y) {

    			// recenter
    			x -= center.x;
    			y -= center.y;

    			// rotate by 90 deg
    			var temp = {
    				x: y,
    				y: -x
    			};

    			var c = Math.cos(-radians),
    				s = Math.sin(-radians);

    			var pt = {
    				x: temp.x * c - temp.y * s,
    				y: temp.x * c + temp.y * s
    			};

    			return pt;
    		},
    		index,
    		maxDistance = 0,
    		maxRatio = 1,
    		// given index, find x, y, distance, and angle
    		x, y, dx, dy, d, a;

    	// max distance must be in one of the four corners
    	var corners = [
    		{ x: start * this.canvas.width, y: 0 },
    		{ x: start * this.canvas.width, y: this.canvas.height },
    		{ x: end * this.canvas.width, y: 0 },
    		{ x: end * this.canvas.width, y: this.canvas.height }
    	];

    	corners.forEach(function(corner) {
    		var dis = perpDistance(corner.x, corner.y);

    		if ( dis > maxDistance ) maxDistance = dis;
    	});

    	// for pixel multiplication
    	maxRatio = 255 / maxDistance;

    	this.loop(function(x, y, pixel) {

    		d = perpDistance(x, y);

    		/* pixel.r += 0;
    		pixel.g += 0;
    		pixel.b += 0; */
    		pixel.a = 0.5 * ( d + maxDistance ) * maxRatio;

    		return pixel;
    	}, true, true);

    	return this;
    }
});
