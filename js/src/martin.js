(function() {

	// The great initializer.
	window.Martin = function( id, init ) {

		// Set the original element.
		this.original = document.getElementById( id );

		if ( !this.original || !id ) {

			throw new Error('Must provide a <canvas> or <img> element.');
		}

		// Now prepare yourself...
		var callback = this.handleLoad;
		this.makeCanvas(callback.bind(this), init);

	};

	// Convert an image to a canvas or just return the canvas.
	Martin.prototype.makeCanvas = function(callback, init) {

		if ( this.original.tagName === 'IMG' ) {

			var _this = this,
				pixelData;

			// run this once we are sure the image has loaded
			var d = function() {

				var canvas = document.createElement('canvas');

				canvas.width = _this.original.width;
				canvas.height = _this.original.height;

				canvas.getContext('2d').drawImage( _this.original, 0, 0 );

				_this.original.parentNode.insertBefore( canvas, _this.original );
				_this.original.parentNode.removeChild( _this.original );
				_this.canvas = canvas;
				_this.context = canvas.getContext('2d');

				return callback(init);
			};

			// if loaded, return
			if ( this.original.complete ) return d();

			// if it hasn't loaded, wait for that event
			this.original.onload = d;



		} else if ( this.original.tagName === 'CANVAS' ) {

			this.canvas = this.original;
			this.context = this.original.getContext('2d');
			return callback(init);

		}
	};

	// Function to handle the element's load.
	// Will only be fired once the <img> is ready (or right away for <canvas>).
	Martin.prototype.handleLoad = function(init) {

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

		this.currentLayer = 0;

		// Now we are ready and can initialize
		return init(this);

	};

	Martin.extend = function( obj ) {
		for ( var method in obj ) {
			Martin.prototype[method] = obj[method];
		}
	};

	// Set or change dimensions.
	[ 'width', 'height' ].forEach(function( which ) {

		Martin.prototype[which] = function( val, resize ) {

			// if no value given, return the corresponding value
			if ( !val ) return this.canvas[which];

			var imageData,
				pixels,
				oldHeight,
				ratio,
				dummyCanvas,
				dummyContext;

			if ( typeof val === 'string' && val.slice(-1) === '%' ) val = (+val.slice(0, -1)) * this.canvas[which] / 100;

			oldHeight = this.canvas.height;

			// Update the container
			this.container.style[which] = val + 'px';

			// get the ratio, in case we're resizing
			ratio = val / this.canvas[which];

			// Update height or width of all the layers' canvases
			// and update their contexts
			for ( var i = this.layers.length - 1; i >= 0; i-- ) {

				imageData = this.layers[i].context.getImageData(
					0,
					which === 'height' && !resize ? this.canvas.height - val : 0,
					this.canvas.width,
					this.canvas.height
				);

				dummyCanvas = document.createElement('canvas');
				dummyContext = dummyCanvas.getContext('2d');

				dummyCanvas.setAttribute('width', this.canvas.width);
				dummyCanvas.setAttribute('height', this.canvas.height);

				dummyContext.putImageData(
					this.layers[i].context.getImageData(
						0,
						0,
						this.canvas.width,
						this.canvas.height
					),
					0,
					0
				);

				this.layers[i].canvas.setAttribute(which, val);

				if ( resize ) {

					this.layers[i].context.scale(
						which === 'width' ? ratio : 1,
						which === 'height' ? ratio : 1
					);
				}

				this.layers[i].context.drawImage(dummyCanvas, 0, which === 'height' && !resize ? val - oldHeight : 0);

			}

			// Since we might have increased dimensions, if a background
			// was already set, make sure that the new size receives that background
			if ( this.layers[0].type === 'background' ) this.background( this.layers[0].fill );

			return this;

		};

	});

	// TODO: crop
	Martin.prototype.crop = function( offsetX, offsetY, x, y ) {

	};

	// Create a new (top-most) layer and switch to that layer.
	// Optional: include pixel data for the new layer
	Martin.prototype.newLayer = function(arg, data) {

		var newCanvas = document.createElement('canvas'),
			layerObject = {};

		newCanvas.width = this.canvas.width;
		newCanvas.height = this.canvas.height;

		this.container.appendChild( newCanvas );

		// Don't forget to set the new context and currentlayer
		this.context = newCanvas.getContext('2d');
		this.currentLayer = this.layers.length;

		// if there is data for the new layer, put it now
		if ( data ) this.context.putImageData(data, 0, 0);

		layerObject.canvas = newCanvas;
		layerObject.context = this.context;

		if ( typeof arg === 'string' ) {
			layerObject.type = arg;
		} else {
			for ( var i in arg ) layerObject[i] = arg[i];
		}

		this.layers.push(layerObject);

		return this;

	};

	Martin.prototype.duplicateLayer = function() {
		this.newLayer( '', this.context.imageData );
		return this;
	};

	Martin.prototype.deleteLayer = function( num ) {

		// don't delete if
		if ( this.layers.length > 1 ) {

			num = num || this.currentLayer;

			this.container.removeChild(this.layers[num].canvas);
			this.layers.splice(num, 1);

		} else {
			throw new Error("Can't delete the only layer.");
		}

		return this;

	};

	Martin.prototype.switchToLayer = function( num ) {

		this.context = this.layers[num || 0].context;
		this.currentLayer = num || 0;

		return this;

	};

	// Merge layers. If given an array i.e. [0, 1, 2, 3], merge those onto the lowest layer.
	// Otherwise merge all the layers and return a single canvas.
	Martin.prototype.mergeLayers = function( layers ) {

		if ( !layers ) layers = this.layers;

		var _this = this;

		function mergeDown(index) {

			if ( index > 0 ) {

				var aboveLayer = layers[index],
					belowLayer = layers[index - 1],
					aboveCanvas = layers[index].canvas;

				// put the new data onto the target layer
				belowLayer.context.drawImage( aboveCanvas, 0, 0 );

				// Remove the old layer from the DOM and update the this.layers array
				_this.container.removeChild( layers[index].canvas );
				layers.pop();

				return mergeDown( index - 1 );
			}
		}

		mergeDown( layers.length - 1 );

		return this;

	};

	Martin.prototype.write = function( arg1, arg2 ) {

		var text, obj;

		if ( typeof arg1 === 'string' ) {
			text = arg1;
			obj = arg2;
		} else {
			obj = arg1;
			text = obj.text || '';
		}

		if ( !obj ) obj = {};

		var size = obj.size || 16;

		var fontString = size + 'px ';
		fontString += obj.font ? '"' + obj.font + '"' : 'sans-serif';

		this.context.font = fontString;
		this.context.fillStyle = obj.color || '#000';
		this.context.textBaseline = 'top';
		this.context.textAlign = obj.align || 'left';
		this.context.fillText(
			text,
			this.normalizeX(obj.offsetX || 0),
			obj.offsetY ? this.normalizeY(obj.offsetY) - size : this.canvas.height - size
		);

		return this;
	};

    // Normalize X and Y values
    Martin.prototype.normalizeX = function( val ) {
		return ( typeof val === 'string' && val.slice(-1) === '%' ) ? this.normalizePercentX( +val.slice(0, -1) ) : val;
    };

    Martin.prototype.normalizeY = function( val ) {
		val = ( typeof val === 'string' && val.slice(-1) === '%' ) ? this.normalizePercentY( +val.slice(0, -1) ) : val;
		// Flip it upside down (a la Cartesian)
		return this.canvas.height - val;
    };

	Martin.prototype.normalizePercentX = function( val ) {
		return ( val / 100 ) * this.canvas.width;
	};

	Martin.prototype.normalizePercentY = function( val ) {
		return ( val / 100 ) * this.canvas.height;
	};

	function degToRad(deg) {
		return deg * ( Math.PI / 180 );
	}

	function radToDeg(rad) {
		return rad * ( 180 / Math.PI );
	}

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

		var originalLayer = this.currentLayer,
			bump = 0;

		// first time background
		if ( this.layers[0].type !== 'background' ) {

			bump = 1; // we bump all other layers

			this.newLayer({
				type: 'background',
				fill: color
			});

			// now get that background we just created
			var background = this.layers.pop(),
				bottom = this.container.firstChild;

			// reassign our layers
			for ( var l = this.layers.length; l >= 0; l-- ) {

				this.layers[l] = this.layers[l - 1] || background;

			}

			this.switchToLayer(0);
			this.container.insertBefore(background.canvas, bottom);

		// if we're redoing the background, just switch to that
		// background layer and work it
		} else {
			this.layers[0].fill = color;
			this.switchToLayer(0);
		}

		var rgb = hexToRGB( color ),
			r = rgb.r,
			g = rgb.g,
			b = rgb.b;

		var imageData = this.context.getImageData( 0, 0, this.canvas.width, this.canvas.height ),
			pixels = imageData.data,
			len = pixels.length;

		for ( var i = 0; i < len; i += 4 ) {

			pixels[i]		= r;
			pixels[i + 1]	= g;
			pixels[i + 2]	= b;
			pixels[i + 3]	= 255;

		}

		this.context.putImageData( imageData, 0, 0 );

		this.switchToLayer(originalLayer + bump);

		return this;

	};

	// Set the fill, stroke, alpha for a new shape
	Martin.prototype.setContext = function( obj ) {

		var c = this.context;

		c.save();

		c.fillStyle = obj.color || '#000';
        c.fill();

		c.globalAlpha = obj.alpha || 1;

		c.lineWidth = obj.strokeWidth ? obj.strokeWidth : 0;
		c.lineCap = obj.cap ? obj.cap : 'square';
        c.strokeStyle = obj.stroke ? obj.stroke : 'transparent';
		c.stroke();

        c.restore();

	};

	// Lines
	Martin.prototype.line = function( obj ) {

		this.context.beginPath();

		this.context.moveTo( this.normalizeX(obj.startX), this.normalizeY(obj.startY) );

		this.context.lineTo( this.normalizeX(obj.endX), this.normalizeY(obj.endY) );

		if ( !obj.strokeWidth ) obj.strokeWidth = 1;
		obj.stroke = obj.color ? obj.color : '#000';

		this.setContext( obj );

		return this;

	};

	// Create a rectangle
	Martin.prototype.rect = function( obj ) {

		if ( !obj.offsetX ) obj.offsetX = 0;
		if ( !obj.offsetY ) obj.offsetY = 0;

		this.context.beginPath();

		this.context.rect(
			this.normalizeX( obj.offsetX ),
			this.normalizeY( obj.offsetY ),
			this.normalizeX( obj.width ),
			-this.canvas.height + this.normalizeY( obj.height ) // we don't *really* want to normalize the height here, just percentage-wise
        );

        this.setContext( obj );

        this.context.closePath();

        return this;
    };

    // Make a circle -- center X, center Y, radius, color
    Martin.prototype.circle = function( obj ) {

		if ( !obj.offsetX ) obj.offsetX = this.width() / 2;
		if ( !obj.offsetY ) obj.offsetY = this.height() / 2;

		var centerX = this.normalizeX( obj.offsetX ),
			centerY = this.normalizeY( obj.offsetY );

		this.context.beginPath();

		this.context.arc( centerX, centerY, obj.radius, 0, 2 * Math.PI, false);

		this.setContext( obj );

		return this;

    };

    // Make an ellipse -- same as circle but with radii for both X and Y
    Martin.prototype.ellipse = function( obj ) {

		if ( !obj.offsetX ) obj.offsetX = this.width() / 2;
		if ( !obj.offsetY ) obj.offsetY = this.height() / 2;

		if ( obj.radiusX === obj.radiusY ) {
			obj.radius = obj.radiusX;
			return this.circle( obj );
		}

		var centerX = this.normalizeX( obj.offsetX ),
			centerY = this.normalizeY( obj.offsetY );

		this.context.beginPath();

		var scale;

		if ( obj.radiusX > obj.radiusY ) {

			scale = obj.radiusX / obj.radiusY;

			this.context.scale( scale, 1 );

			this.context.arc( centerX / scale, centerY, obj.radiusX / scale, 0, 2 * Math.PI, false);

		} else {

			scale = obj.radiusY / obj.radiusX;

			this.context.scale( 1, scale );

			this.context.arc( centerX, centerY / scale, obj.radiusY / scale, 0, 2 * Math.PI, false);

		}

		this.setContext( obj );

		this.context.restore();

		return this;

    };

    // Given an array of points i.e. [ [0, 10], [5, 20], [0, 15] ], draw a polygon.
    // Points are parsed as pixels if integers or percentage if of the form '10%'
    Martin.prototype.polygon = function( arr, obj ) {

		if ( typeof obj === 'string' ) obj = { color: obj };

		this.context.beginPath();

		for (var i = 0; i < arr.length; i++) {

			var toX = this.normalizeX( arr[i][0] ),
				toY = this.normalizeY( arr[i][1] );

			if ( i === 0 ) this.context.moveTo( toX, toY );

			this.context.lineTo( toX, toY );

		}

		// close the path
		this.context.lineTo( this.normalizeX(arr[0][0]), this.normalizeY(arr[0][1]) );

		this.setContext( obj );

		this.context.closePath();

		return this;

    };

	// Desaturate
	Martin.prototype.desaturate = function(amt, all) {
		var _this = this;

		amt = amt / 100;
		if ( amt > 1 ) amt = 1;

		function desaturate(layer) {

			_this.switchToLayer(layer);

			_this.loop(function(x, y, pixel) {

				var r = pixel.r,
					g = pixel.g,
					b = pixel.b;

				var grayscale = r * 0.3 + g * 0.59 + b * 0.11;
					r = (1 - amt) * r + amt * grayscale;        // red
					g = (1 - amt) * g + amt * grayscale;        // green
					b = (1 - amt) * b + amt * grayscale;        // blue

				pixel.r = r;
				pixel.g = g;
				pixel.b = b;

				return pixel;
			});
		}

		// if not all, just current layer, otherwise all layers
		if ( !all ) {
			desaturate(this.currentLayer);
		} else {
			this.layers.forEach(function(layer, i) {
				desaturate(i);
			});
		}

		return this;
	};

	Martin.prototype.saturate = function( amt, all ) {
		return this.desaturate( -amt, all );
	};

    // Lighten and darken. (Darken just returns the opposite of lighten).
    // Takes an input from 0 to 100. Higher values return pure white or black.
    Martin.prototype.lighten = function( amt, all ) {

		var _this = this;

		function makeLighten(layer) {

			_this.switchToLayer(layer);

			_this.loop(function(x, y, pixel) {

				pixel.r += Math.round(amt * 255 / 100);
				pixel.g += Math.round(amt * 255 / 100);
				pixel.b += Math.round(amt * 255 / 100);

				return pixel;
			});
		}

		if ( !all ) {
			makeLighten(this.currentLayer);
		} else {
			this.layers.forEach(function(layer, i) {
				makeLighten(i);
			});
		}

		return this;

	};

	Martin.prototype.darken = function( amt ) {

		this.lighten( -amt );

		return this;
	};

	// Fade uniform
	Martin.prototype.opacity = function( amt, all ) {

		var _this = this;

		function makeOpacity(layer) {

			_this.switchToLayer(layer);

			_this.loop(function(x, y, pixel) {
				pixel.a *= amt;
				return pixel;
			});
		}

		if ( !all ) {
			makeOpacity(this.currentLayer);
		} else {
			this.layers.forEach(function(layer, i) {
				makeOpacity(i);
			});
		}

		return this;

	};

	// Gradients.
	// {
	//	0: '#000'
	//  25: '#000',
	//  100: '#fff',
	//	angle: 45
	// }
	Martin.prototype.gradient = function( obj ) {

		// angle += 90 because we refer to the perpendicular to the line
		// formed by the original angle to determine our gradient
		var angle = obj.angle ? obj.angle + 90 : 90,
			radians = degToRad(angle),
			slope = Math.tan(radians);
		// if the absolute value of the slope is very very high (that is, a vertical line)
		// set it to false and check against this later
		if ( Math.abs(slope) > 10000 ) slope = false;

		var center = {
				x: Math.floor(this.canvas.width / 2) || obj.centerX,
				y: Math.floor(this.canvas.height / 2) || obj.centerY
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
			rotate = function(x, y, log) {

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
			x, y, dx, dy, d, a,
			imageData = this.context.getImageData( 0, 0, this.canvas.width, this.canvas.height ),
			pixels = imageData.data,
			len = pixels.length;

		// max distance must be in one of the four corners
		var corners = [
			{ x: 0, y: 0 },
			{ x: 0, y: this.canvas.height },
			{ x: this.canvas.width, y: 0 },
			{ x: this.canvas.width, y: this.canvas.height }
		];

		corners.forEach(function(corner) {
			var dis = perpDistance(corner.x, corner.y);

			if ( dis > maxDistance ) maxDistance = dis;
		});

		maxRatio = 255 / maxDistance;

		for ( var i = 0; i < len; i += 4 ) {
			index = i / 4;

			x = Math.floor(index % this.canvas.width);
			y = this.canvas.height - Math.floor(index / this.canvas.width);

			d = perpDistance(x, y);

			pixels[i] += 0;
			pixels[i + 1] += 0;
			pixels[i + 2] += 0;
			pixels[i + 3] = 0.5 * ( d + maxDistance ) * maxRatio;
		}

		this.context.putImageData( imageData, 0, 0 );

		return this;
	};

	// Replace a canvas with an image with a src of its data URL
	Martin.prototype.convertToImage = function() {

		this.mergeLayers();

		var img = new Image();
		img.src = this.layers[0].canvas.toDataURL();

		this.container.removeChild( this.layers[0].canvas );
		this.container.appendChild( img );

	};

	// Loop through the image data
	Martin.prototype.loop = function(cb, put) {

		var imageData = this.context.getImageData( 0, 0, this.width(), this.height() ),
            pixels = imageData.data,
            len = pixels.length,
			n,
			x,
			y,
			r, g, b, a,
			pixel,
			output;

		for ( var i = 0; i < len; i += 4 ) {

			// xy coordinates
			n = i / 4;
			x = n % this.width();
			y = this.height() - Math.floor(n / this.width());

			// rgba values
			r = pixels[i];
			g = pixels[i + 1];
			b = pixels[i + 2];
			a = pixels[i + 3];

			// pass an object corresponding to the pixel to the callback
			pixel = { r: r, g: g, b: b, a: a };

			// execute the callback within the context of this instance
			output = cb.call( this, x, y, pixel );

			// reassign the actual rgba values of the pixel based on the output from the loop
			pixels[i] = output.r;
			pixels[i + 1] = output.g;
			pixels[i + 2] = output.b;
			pixels[i + 3] = output.a;

		}

		// explicitly declare if image data from callback is not to be used
		if ( put !== false ) this.context.putImageData( imageData, 0, 0 );

		return this;
	};

	Martin.prototype.putImageData = function(imageData) {
		this.context.putImageData( imageData, 0, 0 );
		return this;
	};

}());
