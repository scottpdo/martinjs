/*
    For utility functions that do extend Martin prototype. Generally for internal
    usage and not the public-facing API, the exception being Martin.extend.

    extend()
    .convertToImage()
    .normalizeX()
    .normalizeY()
    .normalizePercentX()
    .normalizePercentY()
    .setContext()
    .loop()
    .putImageData()
*/

// Extend Martin with plugins, if you want
Martin.extend = function( obj ) {
    for ( var method in obj ) {
        Martin.prototype[method] = obj[method];
    }
};

// Replace a canvas with an image with a src of its data URL
Martin.prototype.convertToImage = function() {

    this.mergeLayers();

    var img = new Image();
    img.src = this.layers[0].canvas.toDataURL();

    this.container.removeChild( this.layers[0].canvas );
    this.container.appendChild( img );

};

// Normalize X and Y values
Martin.prototype.normalizeX = function( val ) {
    return ( typeof val === 'string' && val.slice(-1) === '%' ) ? this.normalizePercentX( +val.slice(0, -1) ) : val;
};

Martin.prototype.normalizeY = function( val ) {
    val = ( typeof val === 'string' && val.slice(-1) === '%' ) ? this.normalizePercentY( +val.slice(0, -1) ) : val;
    // Flip it upside down (a la Cartesian)
    return this.canvas.height - val;
};

Martin.prototype.normalizePercentX = function( val ) {
    return ( val / 100 ) * this.canvas.width;
};

Martin.prototype.normalizePercentY = function( val ) {
    return ( val / 100 ) * this.canvas.height;
};

// Set the fill, stroke, alpha for a new shape
Martin.prototype.setContext = function( obj ) {

    var c = this.context;

    c.save();

    c.fillStyle = obj.color || '#000';
    c.fill();

    c.globalAlpha = obj.alpha || 1;

    c.lineWidth = obj.strokeWidth ? obj.strokeWidth : 0;
    c.lineCap = obj.cap ? obj.cap : 'square';
    c.strokeStyle = obj.stroke ? obj.stroke : 'transparent';
    c.stroke();

    c.restore();

};

// Loop through the image data
Martin.prototype.loop = function(cb, put) {

    var imageData = this.context.getImageData( 0, 0, this.width(), this.height() ),
        pixels = imageData.data,
        len = pixels.length,
        n,
        x,
        y,
        r, g, b, a,
        pixel,
        output;

    for ( var i = 0; i < len; i += 4 ) {

        // xy coordinates
        n = i / 4;
        x = n % this.width();
        y = this.height() - Math.floor(n / this.width());

        // rgba values
        r = pixels[i];
        g = pixels[i + 1];
        b = pixels[i + 2];
        a = pixels[i + 3];

        // pass an object corresponding to the pixel to the callback
        pixel = { r: r, g: g, b: b, a: a };

        // execute the callback within the context of this instance
        output = cb.call( this, x, y, pixel );

        // reassign the actual rgba values of the pixel based on the output from the loop
        pixels[i] = output.r;
        pixels[i + 1] = output.g;
        pixels[i + 2] = output.b;
        pixels[i + 3] = output.a;

    }

    // explicitly declare if image data from callback is not to be used
    if ( put !== false ) this.context.putImageData( imageData, 0, 0 );

    return this;
};

// Simple shell for putting image data
Martin.prototype.putImageData = function(imageData) {
    this.context.putImageData( imageData, 0, 0 );
    return this;
};
