(function() {

	window.Martin = function( id ) {

		if ( !id ) {

			return false;

		}

		this.original = document.getElementById( id );

		if ( !this.original ) {

			return false;

		}

		// In case the element selected is an image,
		// wait for it to load before initializing
		this.original.onload = this.handleLoad();

	};

	Martin.prototype.handleLoad = function() {

		this.canvas = this.makeCanvas();

		if ( this.canvas ) {

			this.context = this.canvas.getContext('2d');

			return this;

		} else {

			return false;

		}

	};

	// Convert an image to a canvas
	Martin.prototype.makeCanvas = function() {

		if ( this.original.tagName === 'IMG' ) {

			var canvas = document.createElement('canvas');

			canvas.width = this.original.width;
			canvas.height = this.original.height;
			
			canvas.getContext('2d').drawImage( this.original, 0, 0 );

			this.original.style.display = 'none';
			this.original.parentNode.insertBefore( canvas, this.original );

			return canvas;

		} else if ( this.original.tagName === 'CANVAS' ) {

			return this.original;

		} else {

			return false;

		}

	};

	// Set or change dimensions
	Martin.prototype.width = function( val ) {

		var imageData = this.context.getImageData( 0, 0, this.canvas.width, this.canvas.height );

		this.canvas.width = val;

		this.context.putImageData(imageData, 0, 0);

		return this;

	};

	Martin.prototype.height = function( val ) {

		var imageData = this.context.getImageData( 0, 0, this.canvas.width, this.canvas.height );

		this.canvas.height = val;

		this.context.putImageData(imageData, 0, 0);

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

	function hexToRGB( hex ) {
		
		if ( !hex ) { return false; }

		if ( hex.slice(0, 1) === '#' ) { hex = hex.slice(1); }
		
		var r, g, b;
		
		if ( hex.length === 6 ) {

			r = hex.slice(0, 2);
			g = hex.slice(2, 4);
			b = hex.slice(4, 6);

		} else if ( hex.length === 3 ) {
			
			r = hex.slice(0, 1) + hex.slice(0, 1);
			g = hex.slice(1, 2) + hex.slice(1, 2);
			b = hex.slice(2, 3) + hex.slice(2, 3);

		}
		console.log(r, g, b);
		return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) };

	}

	// Method for giving a canvas a background color.
	// Only target semi-transparent pixels, and use a weighted
	// average to calculate the outcome.
	Martin.prototype.background = function( color ) {

		var imageData = this.context.getImageData( 0, 0, this.canvas.width, this.canvas.height ),
			pixels = imageData.data,
			len = pixels.length;

		var rgb = hexToRGB( color ),
			r = rgb.r,
			g = rgb.g,
			b = rgb.b;

		for (var i = 0; i < len; i += 4) {

			if ( pixels[i + 3] < 255 ) {

				var alpha = pixels[i + 3] / 255;

				pixels[i]		= ( ( 1 + alpha) * pixels[i] + r ) / ( 1 + alpha );
				pixels[i + 1]	= ( ( 1 + alpha) * pixels[i + 1] + g ) / ( 1 + alpha );
				pixels[i + 2]	= ( ( 1 + alpha) * pixels[i + 2] + b ) / ( 1 + alpha );
				pixels[i + 3]	= 255;

			}

		}

		this.context.putImageData( imageData, 0, 0 );

		return this;

	};

	// Create a rectangle with position, dimensions, determined percentage-wise.
	// Takes five inputs -- the x offset, y offset, width, and height (all normalized 
	// relative to the canvas), and the color of the rectangle.
	Martin.prototype.rect = function( offsetX, offsetY, width, height, color, alpha ) {

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

        this.context.fillStyle = color || '#000';
        this.context.globalAlpha = alpha || 1;

        this.context.fillRect(
			attributes.offsetX,
			this.canvas.height - attributes.offsetY - attributes.height,
			attributes.width,
			attributes.height
        );

        return this;
    };

    // Make a circle -- center X, center Y, radius, color
    Martin.prototype.circle = function( offsetX, offsetY, radius, color, alpha ) {

		var centerX = typeof offsetX === 'string' && offsetX.slice(-1) === '%' ? this.normalizePercentX( +offsetX.slice(0, -1) ) : offsetX,
			centerY = typeof offsetY === 'string' && offsetY.slice(-1) === '%' ? this.normalizePercentY( +offsetY.slice(0, -1) ) : offsetY;

		this.context.beginPath();

		this.context.fillStyle = color || '#000';
		this.context.globalAlpha = alpha || 1;

		this.context.arc( centerX, this.canvas.height - centerY, radius, 0, 2 * Math.PI, false);
		this.context.fill();

		return this;

    };

    // Given an array of points i.e. [ [0, 10], [5, 20], [0, 15] ], draw a polygon.
    // Points are parsed as pixels if integers or percentage if of the form '10%'
    Martin.prototype.polygon = function( arr, color, alpha ) {

		this.context.fillStyle = color || '#000';
		this.context.globalAlpha = alpha || 1;

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

		this.lighten( -amt );

		return this;
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