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

                // switch to bottom layer
                var curLayer = this.currentLayer.stackIndex();
                this.layer(0);

                canvas.width = original.naturalWidth;
                canvas.height = original.naturalHeight;

                this.width(canvas.width);
                this.height(canvas.height);

                original.parentNode.insertBefore( canvas, original );
                original.parentNode.removeChild( original );

                // Give that layer some image data (see src/element/image.js)
                Martin.registerElement('image', function(img) {
                    drawImage.call(this, img);
                });

                this.image(original).bumpToBottom();

                // switch back to previous layer
                this.layer(curLayer);
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
