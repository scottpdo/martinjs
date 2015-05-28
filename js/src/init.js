/*
    Martin.js: In-browser photo and image editing
    Author: Scott Donaldson
    Contact: scott.p.donaldson@gmail.com
    Twitter: @scottpdonaldson
    Version: 0.1.3.1-beta

    ----------------------------------------

    MARTIN
    _version
    .makeCanvas()
    .handleLoad()
*/

// The great initializer.
window.Martin = function( id, init ) {

    if ( !(this instanceof Martin) ) return new Martin( id, init );

    // Set the original element.
    this.original = document.getElementById( id );

    if ( !this.original || !id ) {

        throw new Error('Must provide a <canvas> or <img> element.');
    }

    // Now prepare yourself...
    var callback = this.handleLoad;
    this.makeCanvas(callback.bind(this), init);

};

Martin._version = '0.1.3.1-beta';

// Convert an image to a canvas or just return the canvas.
Martin.prototype.makeCanvas = function(callback, init) {

    if ( this.original.tagName === 'IMG' ) {

        var _this = this,
            pixelData;

        // run this once we are sure the image has loaded
        var d = function() {

            var canvas = document.createElement('canvas');

            canvas.width = _this.original.naturalWidth;
            canvas.height = _this.original.naturalHeight;

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
