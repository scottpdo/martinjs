// Convert an image to a canvas or just return the canvas.
Martin.prototype.makeCanvas = function() {

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    // Create an empty layer
    this.newLayer();

    if ( this.original ) {

        if ( this.original.tagName === 'IMG' ) {

            var canvas = this.canvas,
                context = this.context,
                original = this.original;

            function d() {

                canvas.width = original.naturalWidth;
                canvas.height = original.naturalHeight;

                this.width(canvas.width);
                this.height(canvas.height);

                original.parentNode.insertBefore( canvas, original );
                original.parentNode.removeChild( original );

                // Give that layer some image data
                new Martin.Element('image', this, {
                    original: original
                });
            }

            // This should only fire once! Fire if the image is complete,
            // or add a handler for once it has finished loading.
            if ( original.complete ) return d.call(this);
            original.onload = d.bind(this);

        } else if ( this.original.tagName === 'CANVAS' ) {

            this.canvas = this.original;
            this.context = this.original.getContext('2d');
        }
    }

    // only render and execute callback immediately
    // if the original is not an image
    this.autorender();

    return this;
};
