/*

    Martin.Layer constructor

    Methods:
    .normalizeX()
    .normalizeY()
    .normalizePercentX()
    .normalizePercentY()
    .loop()
    .setContext()
    .getImageData()
    .putImageData()
    .render()
    .clear()
    .remove()
    .addElement()

    Methods for working with Layers

    .newLayer()
    .layer()
*/

// ----- Layer constructor
Martin.Layer = function(base, arg) {

    this.base = base;
    this.canvas = document.createElement('canvas');
    this.canvas.width = base.original ? (base.original.naturalWidth || base.original.width) : base.width();
    this.canvas.height = base.original ? (base.original.naturalHeight || base.original.height) : base.height();
    this.context = this.canvas.getContext('2d');
    this.scale = {
        x: 1,
        y: 1
    };

    if ( typeof arg === 'string' ) {
        this.type = arg;
    } else {
        for ( var i in arg ) this[i] = arg[i];
    }

    return this;

};

// Normalize X and Y values
Martin.Layer.prototype.normalizeX = function( val ) {
    if ( typeof val === 'string' && val.slice(-1) === '%' ) {
        val = this.normalizePercentX( +val.slice(0, -1) );
    }
    return val / this.scale.x;
};

Martin.Layer.prototype.normalizeY = function( val ) {
    if ( typeof val === 'string' && val.slice(-1) === '%' ) {
        val = this.normalizePercentY( +val.slice(0, -1) );
    }
    return val / this.scale.y;
};

Martin.Layer.prototype.normalizePercentX = function( val ) {
    return ( val / 100 ) * this.canvas.width;
};

Martin.Layer.prototype.normalizePercentY = function( val ) {
    return ( val / 100 ) * this.canvas.height;
};

// Loop through the image data
Martin.Layer.prototype.loop = function(cb, put) {

    var width = this.base.width(),
        height = this.base.height();

    var imageData = this.getImageData(),
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
        x = n % width;
        y = Math.floor(n / height);

        // rgba values
        r = pixels[i];
        g = pixels[i + 1];
        b = pixels[i + 2];
        a = pixels[i + 3];

        // pass an object corresponding to the pixel to the callback
        pixel = { r: r, g: g, b: b, a: a };

        // execute the callback within the context of this layer's, uh... context
        output = cb.call( this.context, x, y, pixel );

        // reassign the actual rgba values of the pixel based on the output from the loop
        pixels[i] = output.r;
        pixels[i + 1] = output.g;
        pixels[i + 2] = output.b;
        pixels[i + 3] = output.a;

    }

    // explicitly declare if image data from callback is not to be used
    if ( put !== false ) this.putImageData( imageData );

    return this;
};

// Set the fill, stroke, alpha for a new shape
Martin.Layer.prototype.setContext = function( obj ) {

    var context = this.context;

    context.save();

    context.fillStyle = obj.color || '#000';
    context.fill();

    context.scale(
        this.scale.x,
        this.scale.y
    );

    context.globalAlpha = obj.alpha || 1;

    context.lineWidth = obj.strokeWidth ? obj.strokeWidth : 0;
    context.lineCap = obj.cap ? obj.cap : 'square';
    context.strokeStyle = obj.stroke ? obj.stroke : 'transparent';
    context.stroke();

    context.restore();

};


Martin.Layer.prototype.getImageData = function() {
    var imageData = this.context && this.canvas.width > 0 && this.canvas.height > 0 ?
        this.context.getImageData(0, 0, this.canvas.width, this.canvas.height) :
        null;
    return imageData;
};

// Simple shell for putting image data
Martin.Layer.prototype.putImageData = function(imageData) {
    this.context.putImageData( imageData, 0, 0 );
    return this;
};

Martin.Layer.prototype.render = function() {
    var base = this.base,
        imageData = this.getImageData();
    // only draw if there is a context for the base --
    // if the <img> or <canvas> hasn't fully initialized
    // this won't run
    if ( base.context ) base.context.drawImage( this.canvas, 0, 0 );
};

Martin.Layer.prototype.clear = function() {
    this.context.clearRect(0, 0, this.base.width(), this.base.height());
    return this;
};

Martin.Layer.prototype.remove = function() {
    this.base.layers.splice(this.base.layers.indexOf(this), 1);
    this.base.autorender();
    return this;
};

// ----- Add an element to a layer
Martin.Layer.prototype.addElement = function(element) {

    if ( !(element instanceof Martin.Element ) ) {
        throw new Error('When adding an element to a layer, it must be created from Martin.Element.');
    }

    if (this.elements) {
        this.elements.push(element);
    } else {
        this.elements = [element];
    }

    return this;
};

// Create a new (top-most) layer and switch to that layer.
Martin.prototype.newLayer = function(arg) {

    var newLayer = new Martin.Layer(this, arg);

    // if no layers yet (initializing),
    // the layers are just this new layer,
    // and the new layer's context should be the base's
    if ( !this.layers ) {
        this.layers = [newLayer];
    } else {
        this.layers.push(newLayer);
    }

    // Don't forget to set the new context and currentlayer
    this.currentLayerIndex = this.layers.length;
    this.currentLayer = newLayer;

    this.autorender();

    return newLayer;

};

// Switch the context and return the requested later
Martin.prototype.layer = function( num ) {

    this.context = this.layers[num || 0].context;
    this.currentLayer = this.layers[num || 0];
    this.currentLayerIndex = num || 0;

    return this.layers[num || 0];

};
