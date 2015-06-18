/*
	Need to find a place for the rest of these important methods.

	.width()
	.height()
*/

// Set or change dimensions.
[ 'width', 'height' ].forEach(function( which ) {

	Martin.prototype[which] = function( val, resize ) {

		var ratio;

		// if no value given, return the corresponding value
		if ( !val ) return this.canvas[which];

		// normalize the value
		if ( typeof val === 'string' && val.slice(-1) === '%' ) val = (+val.slice(0, -1)) * this.canvas[which] / 100;

		// get the ratio, in case we're resizing
		ratio = resize ? val / this.canvas[which] : 1;

		// update dimensions of base canvas
		this.canvas[which] = val;
		this.context.scale(
			which === 'width' ? ratio : 1,
			which === 'height' ? ratio : 1
		);

		// Update height or width of all the layers' canvases
		// and update their contexts
		this.layers.forEach(function(layer, i) {

			layer.canvas[which] = val;
			layer.context.scale(
				which === 'width' ? ratio : 1,
				which === 'height' ? ratio : 1
			);

			layer.renderLayer();

		});

		return this;

	};
});
