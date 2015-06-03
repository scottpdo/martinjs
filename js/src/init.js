/*
    Martin.js: In-browser photo and image editing
    Author: Scott Donaldson
    Contact: scott.p.donaldson@gmail.com
    Twitter: @scottpdonaldson

    ----------------------------------------

    MARTIN
    .makeCanvas()
    .handleLoad()
    _version
*/

// The great initializer.
window.Martin = function( id ) {
    if ( !(this instanceof Martin) ) return new Martin( id );

    // Set the original element.
    this.original = document.getElementById( id );

    if ( !this.original || !id ) {

        throw new Error('Must provide a <canvas> or <img> element.');
    }

    // Now prepare yourself...
    return this.makeCanvas();

};

// Convert an image to a canvas or just return the canvas.
Martin.prototype.makeCanvas = function() {

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    // Create an empty layer
    this.newLayer();

    if ( this.original.tagName === 'IMG' ) {

        var canvas = this.canvas,
            context = this.context,
            original = this.original;

        canvas.width = original.naturalWidth;
        canvas.height = original.naturalHeight;

        original.parentNode.insertBefore( canvas, original );
        original.parentNode.removeChild( original );

        // Give that layer some image data
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        new Martin.Element('image', this, {
            original: original
        });

    } else if ( this.original.tagName === 'CANVAS' ) {

        this.canvas = this.original;
        this.context = this.original.getContext('2d');

    }

    return this;
};

// DON'T EDIT THIS LINE.
// Automatically updated w/ Gulp
Martin._version = '0.2.2-alpha';
