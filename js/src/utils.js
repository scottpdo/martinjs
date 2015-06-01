/*
    For utility functions that do extend Martin prototype. Generally for internal
    usage and not the public-facing API, the exception being Martin.extend.

    extend()
    .render()
    .toDataURL()
    .convertToImage()
    .normalizeX()
    .normalizeY()
    .normalizePercentX()
    .normalizePercentY()
    setContext()
    .loop()
    .putImageData()
*/

// Extend Martin with plugins, if you want
Martin.extend = function( obj ) {
    for ( var method in obj ) {
        Martin.prototype[method] = obj[method];
    }
};

// Render: looping through layers, loop through elements and render each
Martin.prototype.render = function() {
    this.layers.forEach(function(layer, i) {
        layer.clearLayer();
        layer.elements.forEach(function(element) {
            element.renderElement();
        });
        layer.renderLayer();
    });
};

// Return's a data URL of all the working layers
Martin.prototype.toDataURL = function() {
    return this.canvas.toDataURL();
};


// Get the dataURL of the merged layers of the canvas,
// then turn that into one image
Martin.prototype.convertToImage = function() {

    var dataURL = this.toDataURL(),
        img = document.createElement('img');

    img.src = dataURL;

    this.layers.forEach(function(layer, i){
        this.deleteLayer(i);
    }, this);

    this.container.appendChild( img );

};

// Normalize X and Y values
Martin.prototype.normalizeX = function( val ) {
    return ( typeof val === 'string' && val.slice(-1) === '%' ) ? this.normalizePercentX( +val.slice(0, -1) ) : val;
};

Martin.prototype.normalizeY = function( val ) {
    return ( typeof val === 'string' && val.slice(-1) === '%' ) ? this.normalizePercentY( +val.slice(0, -1) ) : val;
};

Martin.prototype.normalizePercentX = function( val ) {
    return ( val / 100 ) * this.canvas.width;
};

Martin.prototype.normalizePercentY = function( val ) {
    return ( val / 100 ) * this.canvas.height;
};

// Set the fill, stroke, alpha for a new shape
Martin.setContext = function( context, obj ) {

    context.save();

    context.fillStyle = obj.color || '#000';
    context.fill();

    context.globalAlpha = obj.alpha || 1;

    context.lineWidth = obj.strokeWidth ? obj.strokeWidth : 0;
    context.lineCap = obj.cap ? obj.cap : 'square';
    context.strokeStyle = obj.stroke ? obj.stroke : 'transparent';
    context.stroke();

    context.restore();

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
