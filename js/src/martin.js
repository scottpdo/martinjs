(function() {

	// The great initializer.
	window.Martin = function( id ) {

		// Must take an ID as a selector which has a corresponding element on the page.
		
		// TODO: allow no selector to be passed, in which case
		// create a new canvas
		if ( !id ) {

			return false;

		}

		// Set the original element.
		this.original = document.getElementById( id );

		if ( !this.original ) {

			return false;

		}

		// In case the element selected is an image,
		// wait for it to load before initializing
		this.original.onload = this.handleLoad();

	};

	// Function to handle the element's load (in case it is an image).
	Martin.prototype.handleLoad = function() {

		this.canvas = this.makeCanvas();

		if ( this.canvas ) {

			this.context = this.canvas.getContext('2d');

			// Refer to the original parent container
			var originalContainer = this.canvas.parentNode;

			// Create a new container (with data-martin)
			// that will house everything in the DOM from here on out
			this.container = document.createElement('div');
			this.container.setAttribute('data-martin', '');
			
			// Insert the new container into the DOM
			originalContainer.insertBefore( this.container, this.canvas );

			// And move the canvas into the new container
			this.container.appendChild( this.canvas );

			// Position the container relatively so that we can absolutely
			// position any children within it. Also set dimensions.
			this.container.style.position = 'relative';
			this.container.style.width = this.canvas.width + 'px';
			this.container.style.height = this.canvas.height + 'px';

			// Create a stylesheet that will declare position all children of [data-martin]
			var style = document.createElement('style');
			style.innerHTML = '[data-martin] *{position:absolute;bottom:0;left:0;}';
			document.head.appendChild(style);

			// Set the layers (currently just this.canvas)
			this.layers = [{
				canvas: this.canvas,
				context: this.context
			}];

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

			this.original.parentNode.insertBefore( canvas, this.original );
			this.original.parentNode.removeChild( this.original );

			return canvas;

		} else if ( this.original.tagName === 'CANVAS' ) {

			return this.original;

		} else {

			return false;

		}

	};

	// Set or change dimensions.
	[ 'width', 'height' ].forEach(function( which ) {

		Martin.prototype[which] = function( val ) {

			var imageData = this.context.getImageData(
				0,
				which === 'height' ? this.canvas[which] - val > 0 ? this.canvas[which] - val : 0 : 0, // want this to be relative to Cartesian grid, also see below 2x
				this.canvas.width,
				this.canvas.height
			);

			// Update the container
			this.container.style[which] = val + 'px';

			// Update height or width of the master canvas
			// and update the context
			this.canvas[which] = val;
			this.context.putImageData( imageData, 0, which === 'height' ? this.canvas[which] - val > 0 ? this.canvas[which] - val : 0 : 0 );

			// Update height or width of all the layers' canvases
			// and update their contexts
			for ( var i = 0; i < this.layers.length; i++ ) {

				var imageData = this.layers[i].context.getImageData(
					0,
					which === 'height' ? this.canvas[which] - val : 0,
					this.canvas.width,
					this.canvas.height
				);

				this.layers[i].canvas[which] = val;
				this.layers[i].context.putImageData( imageData, 0, which === 'height' ? this.canvas[which] - val > 0 ? this.canvas[which] - val : 0 : 0 );

			}

			return this;

		};

	});

	// TODO: crop
	Martin.prototype.crop = function( offsetX, offsetY, x, y ) {

	}

	// Create a new (top-most) layer and switch to that layer.
	Martin.prototype.newLayer = function() {

		var newCanvas = document.createElement('canvas');

		newCanvas.width = this.canvas.width;
		newCanvas.height = this.canvas.height;

		this.container.appendChild( newCanvas );

		// Don't forget to set the new context
		this.context = newCanvas.getContext('2d');

		this.layers.push({
			canvas: newCanvas,
			context: newCanvas.getContext('2d')
		});

		return this;

	};

	Martin.prototype.switchToLayer = function( num ) {

		this.context = this.layers[num].context;

		return this;

	};

	// Merge layers. If given an array i.e. [0, 1, 2, 3], merge those onto the lowest layer.
	// Otherwise merge all the layers and return a single canvas.
	Martin.prototype.mergeLayers = function( layers ) {

		if ( !layers ) { 

			layers = this.layers; 

		}

		for (var i = layers.length - 1; i > 0; i-- ) {

			var aboveImageData = layers[i].context.getImageData( 0, 0, this.canvas.width, this.canvas.height ),
				abovePixels = aboveImageData.data,
				aboveLen = abovePixels.length,
				belowImageData = layers[i - 1].context.getImageData( 0, 0, this.canvas.width, this.canvas.height )
				belowPixels = belowImageData.data;

			for ( var j = 0; j < aboveLen; j+= 4 ) {

				// TODO: transparency
				if ( abovePixels[j + 3] > 0 ) {

					belowPixels[j]		= abovePixels[j];
					belowPixels[j + 1]	= abovePixels[j + 1];
					belowPixels[j + 2]	= abovePixels[j + 2];
				
				}
			
			}

			// put the new data onto the target layer
			layers[i - 1].context.putImageData( belowImageData, 0, 0 );

			// Remove the old layer from the DOM and update the this.layers array
			this.container.removeChild( this.layers[i].canvas );
			this.layers = this.layers.slice( 0, -1 );

		}

		return this;

	}

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

		return { 
			r: parseInt(r, 16),
			g: parseInt(g, 16),
			b: parseInt(b, 16) 
		};

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

    // Make an ellipse -- same as circle but radius is first X, then Y
    Martin.prototype.ellipse = function( offsetX, offsetY, radiusX, radiusY, color, alpha ) {

    	if ( radiusX === radiusY ) {
    		return this.circle( offsetX, offsetY, radiusX, color, alpha );
    	}

    	var centerX = typeof offsetX === 'string' && offsetX.slice(-1) === '%' ? this.normalizePercentX( +offsetX.slice(0, -1) ) : offsetX,
			centerY = typeof offsetY === 'string' && offsetY.slice(-1) === '%' ? this.normalizePercentY( +offsetY.slice(0, -1) ) : offsetY;

		this.context.beginPath();

		this.context.fillStyle = color || '#000';
		this.context.globalAlpha = alpha || 1;

		this.context.save();

		var scale;

		if ( radiusX > radiusY ) {

			scale = radiusX / radiusY;

			this.context.scale( scale, 1 );

			this.context.arc( centerX / scale, this.canvas.height - centerY, radiusX / 2, 0, 2 * Math.PI, false);
		
		} else {

			scale = radiusY / radiusX;

			this.context.scale( 1, scale );

			this.context.arc( centerX, ( this.canvas.height - centerY ) / scale, radiusY / 2, 0, 2 * Math.PI, false);
		
		}
		
		this.context.fill();

		this.context.restore();

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

	// Replace a canvas with an image with a src of its data URL
	Martin.prototype.convertToImage = function() {

		this.mergeLayers();

		var img = new Image();
		img.src = this.canvas.toDataURL();

		this.container.removeChild( this.canvas );
		this.container.appendChild( img );

	};

}());