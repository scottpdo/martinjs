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

		var layer = this,
			ratio;

		if ( !val ) return this.canvas[which];

		// normalize the value
		val = this['normalize' + (which === 'width' ? 'X' : 'Y')](val);

		// resize this layer's canvas
		this.canvas[which] = val;

		// resize element canvases
		Martin.utils.forEach(this.elements, function(element) {
			element.canvas[which] = val;

			// if relatively positioned, reposition
			if ( element.relativePosition ) {
				if ( element.data.percentX ) {
					element.data.x = layer.normalizeX(element.data.percentX);
				}
				if ( element.data.percentY ) {
					element.data.y = layer.normalizeY(element.data.percentY);
				}
			}
		});

		// get the ratio, in case we're resizing
		ratio = resize ? val / this.canvas[which] : 1;

		if ( resize ) {

			if ( which === 'width' ) this.scale.x *= ratio;
			if ( which === 'height' ) this.scale.y *= ratio;

			this.canvas[which] = val;
		}

		this.base.autorender();

		return this;
	};
});
