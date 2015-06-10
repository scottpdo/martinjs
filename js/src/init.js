/*
    Martin.js: In-browser photo and image editing
    Author: Scott Donaldson
    Contact: scott.p.donaldson@gmail.com
    Twitter: @scottpdonaldson

    ----------------------------------------

    MARTIN
    .makeCanvas()
    _version
*/

// The great initializer.
window.Martin = function( id ) {

    if ( !(this instanceof Martin) ) return new Martin( id );

    // Set the original element, if there is one
    this.original = document.getElementById( id ) || null;

    // Now prepare yourself...
    return this.makeCanvas();

};

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

                original.parentNode.insertBefore( canvas, original );
                original.parentNode.removeChild( original );

                // Give that layer some image data
                new Martin.Element('image', this, {
                    original: original
                });
            }

            original.onload = d.bind(this);
            if ( original.complete ) d();

        } else if ( this.original.tagName === 'CANVAS' ) {

            this.canvas = this.original;
            this.context = this.original.getContext('2d');
        }
    }

    // only render and execute callback immediately
    // if the original is not an image
    this.render();

    return this;
};

// DON'T EDIT THIS LINE.
// Automatically updated w/ Gulp
Martin._version = '0.2.3-alpha';
