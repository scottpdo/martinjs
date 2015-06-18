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

		// Update height or width of all the layers' canvases
		// and update their contexts
		this.canvas[which] = val;
		this.layers.forEach(function(layer) {
			layer[which](val, resize);
		});

		return this;

	};

	Martin.Layer.prototype[which] = function(val, resize) {

		var ratio;

		if ( !val ) return this.canvas[which];

		// normalize the value
		if ( typeof val === 'string' && val.slice(-1) === '%' ) val = (+val.slice(0, -1)) * this.canvas[which] / 100;

		// get the ratio, in case we're resizing
		ratio = resize ? val / this.canvas[which] : 1;

		if ( which === 'width' ) this.scale.x *= ratio;
		if ( which === 'height' ) this.scale.y *= ratio;

		this.context.scale(
			this.scale.x,
			this.scale.y
		);

		this.base.render();

		return this;
	};
});
