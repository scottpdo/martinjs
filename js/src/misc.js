/*
	Need to find a place for the rest of these important methods.

	.width()
	.height()
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

		// normalize the value
		if ( typeof val === 'string' && val.slice(-1) === '%' ) val = (+val.slice(0, -1)) * this.canvas[which] / 100;

		oldHeight = this.canvas.height;

		// get the ratio, in case we're resizing
		ratio = val / this.canvas[which];

		// Update height or width of all the layers' canvases
		// and update their contexts
		this.layers.forEach(function(layer, i) {

			imageData = layer.getImageData();

			dummyCanvas = document.createElement('canvas');
			dummyContext = dummyCanvas.getContext('2d');

			dummyCanvas.setAttribute('width', layer.base.width);
			dummyCanvas.setAttribute('height', layer.base.height);

			dummyContext.putImageData( imageData, 0, 0 );

			layer.canvas[which] = val;

			if ( resize ) {

				layer.context.scale(
					which === 'width' ? ratio : 1,
					which === 'height' ? ratio : 1
				);
			}

			layer.context.drawImage(dummyCanvas, 0, 0);

		});

		return this;

	};
});
