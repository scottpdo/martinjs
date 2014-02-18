(function(){

	window.Martin = function( obj ) {

		this.canvas = document.getElementById( obj.id );

		if ( !this.canvas || this.canvas.tagName !== 'CANVAS' ) {
			return false;
		}

		this.context = this.canvas.getContext('2d');

		if ( obj.background ) {
			this.rect( 0, 0, '100%', '100%', obj.background );
		}

		return this;

	};

    // Functions to normalize X and Y values from percentages (Cartesian-style)
    // and return pixel values that work within the canvas
	Martin.prototype.normalizePercentX = function( val ) {
		return ( val / 100 ) * this.canvas.width;
	};
	Martin.prototype.normalizePercentY = function( val ) { 
		return ( val / 100 ) * this.canvas.height;
	};

	// Create a rectangle with position, dimensions, determined percentage-wise.
	// Takes five inputs -- the x offset, y offset, width, and height (all normalized 
	// relative to the canvas), and the color of the rectangle.
	Martin.prototype.rect = function( offsetX, offsetY, width, height, color ) {

		var _this = this,
			attributes = {
				offsetX: offsetX,
				offsetY: offsetY,
				width: width,
				height: height
			},
			i = 0;

		for ( var attr in attributes ) {

			if ( typeof attributes[attr] === 'string' && attributes[attr].slice(-1) === '%' ) {

				attributes[attr] = i % 2 === 0 ? _this.normalizePercentX( +attributes[attr].slice(0, -1) ) : _this.normalizePercentY( +attributes[attr].slice(0, -1) );

			}

			i++;

		}

        this.context.fillStyle = color;

        this.context.fillRect(
        	attributes.offsetX,
        	this.canvas.height - attributes.offsetY - attributes.height,
        	attributes.width,
        	attributes.height
        );

        return this;
    };

    // Given an array of points i.e. [ [0, 10], [5, 20], [0, 15] ], draw a polygon.
    // Points are parsed as pixels if integers or percentage if of the form '10%'
    Martin.prototype.polygon = function( arr, color ) {

    	var height = 0;

    	for (var i = 1; i < arr.length; i++) {

    		height = Math.abs(arr[i][1] - arr[i - 1][1]) > height ? Math.abs(arr[i][1] - arr[i - 1][1]) : height;
		}

		this.context.fillStyle = color;
    	this.context.beginPath();
    	this.context.moveTo( arr[0][0], this.canvas.height - arr[0][1] );

		for (var i = 0; i < arr.length; i++) {

    		this.context.lineTo( arr[i][0], this.canvas.height - arr[i][1] );

		}

    	this.context.closePath();
    	this.context.fill();

    };

    // "Replace" a canvas with an image by hiding the canvas and inserting
    // an image with a src of its data URL
    Martin.prototype.convertToImage = function() {

    	var img = new Image();
    	img.src = this.canvas.toDataURL();

    	this.canvas.style.display = 'none';
    	this.canvas.parentNode.insertBefore( img, this.canvas );

    }

}());