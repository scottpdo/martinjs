(function() {

	window.Martin = function( obj ) {

		if ( typeof obj === 'string' ) {

			obj = {
				id: obj
			};

		}

		this.obj = obj;

		this.original = document.getElementById( obj.id );

		if ( !this.original ) {

			return false;

		}

		var _this = this;

		// In case the element selected is an image,
		// wait for it to load before initializing
		this.original.onload = this.handleLoad();

	};

	Martin.prototype.handleLoad = function() {

		this.canvas = this.convertToCanvas();

		if ( this.canvas ) {

			this.context = this.canvas.getContext('2d');

			if ( this.obj.background ) {

				this.rect( 0, 0, '100%', '100%', this.obj.background );

			}

			return this;

		} else {

			return false;

		}

	};

	// Convert an image to a canvas
	Martin.prototype.convertToCanvas = function() {

		var canvas = document.createElement('canvas');

		canvas.width = this.original.width;
		canvas.height = this.original.height;
		
		canvas.getContext('2d').drawImage( this.original, 0, 0 );

		this.original.style.display = 'none';
		this.original.parentNode.insertBefore( canvas, this.original );

		return canvas;

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

		if ( !color ) { color = '#000'; }
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

    	if ( !color ) { color = '#000'; }
		this.context.fillStyle = color;
		this.context.beginPath();

		for (var i = 0; i < arr.length; i++) {

			var toX = typeof arr[i][0] === 'string' && arr[i][0].slice(-1) === '%' ? this.normalizePercentX( arr[i][0].slice(0, -1) ) : arr[i][0],
				toY = typeof arr[i][1] === 'string' && arr[i][1].slice(-1) === '%' ? this.normalizePercentY( arr[i][1].slice(0, -1) ) : arr[i][1];

			if ( i === 0 ) {
				this.context.moveTo( toX, this.canvas.height - toY );
			}

			this.context.lineTo( toX, this.canvas.height - toY );

		}

		this.context.closePath();
		this.context.fill();

		return this;

    };

    // Convert the canvas to black and white
    Martin.prototype.toBW = function() {

		var imageData = this.context.getImageData( 0, 0, this.canvas.width, this.canvas.height ),
			pixels = imageData.data,
			len = pixels.length;

		for (var i = 0; i < len; i += 4) {

			var grayscale = pixels[i] * 0.3 + pixels[i + 1] * 0.59 + pixels[i + 2] * 0.11;
				pixels[i]     = grayscale;        // red
				pixels[i + 1] = grayscale;        // green
				pixels[i + 2] = grayscale;        // blue
		}

		this.context.putImageData( imageData, 0, 0 );

		return this;
	};

    // Lighten and darken. (Darken just returns the opposite of lighten).
    // Takes an input from 1 to 100. Higher values return pure white or black.
    Martin.prototype.lighten = function( amt ) {

		var imageData = this.context.getImageData( 0, 0, this.canvas.width, this.canvas.height ),
			pixels = imageData.data,
			len = pixels.length;

		for (var i = 0; i < len; i += 4) {
 
			pixels[i] += Math.round(amt * 256 / 100);
			pixels[i + 1] += Math.round(amt * 256 / 100);
			pixels[i + 2] += Math.round(amt * 256 / 100);

		}

		this.context.putImageData( imageData, 0, 0 );

		return this;

	};

	Martin.prototype.darken = function( amt ) {
		return this.lighten( -amt );
	};

	// "Replace" a canvas with an image by hiding the canvas and inserting
	// an image with a src of its data URL
	Martin.prototype.convertToImage = function() {

		var img = new Image();
		img.src = this.canvas.toDataURL();

		this.canvas.style.display = 'none';
		this.canvas.parentNode.insertBefore( img, this.canvas );

	};

}());