/*
	Need to find a place for the rest of these important methods.

	.width()
	.height()
	.write()
	.background()
	.gradient()
*/

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

	var rgb = Martin.hexToRGB( color ),
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

	this.putImageData( imageData );

	this.switchToLayer(originalLayer + bump);

	return this;

};
