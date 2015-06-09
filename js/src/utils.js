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
        layer.effects.forEach(function(effect) {
            effect.renderEffect();
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
