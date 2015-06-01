/*
    .newLayer()
    .duplicateLayer()
    .deleteLayer()
    .clearLayer()
    .switchToLayer()
    .mergeLayers()
*/

// ----- Layer constructor
Martin.Layer = function(base, arg, data, elements) {

    this.base = base;
    this.canvas = document.createElement('canvas');
    this.canvas.width = base.width();
    this.canvas.height = base.height();
    this.context = this.canvas.getContext('2d');

    if ( typeof arg === 'string' ) {
        this.type = arg;
    } else {
        for ( var i in arg ) this[i] = arg[i];
    }

    if ( data ) this.context.putImageData( data, 0, 0 );

    this.elements = [] || elements;

    return this;

};

Martin.Layer.prototype.getImageData = function() {
    var imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    return imageData;
};

Martin.Layer.prototype.renderLayer = function() {
    var base = this.base,
        imageData = this.getImageData();
    base.context.drawImage( this.canvas, 0, 0 );
};

Martin.Layer.prototype.clearLayer = function() {
    this.context.clearRect(0, 0, this.base.width(), this.base.height());
};

// ----- Add an element to a layer
Martin.Layer.prototype.addElement = function(element) {
    this.elements.push(element);
    return element;
};

// Create a new (top-most) layer and switch to that layer.
// Optional: include pixel data and elements for the new layer
Martin.prototype.newLayer = function(arg, data, elements) {

    var newLayer = new Martin.Layer(this, arg, data, elements);

    // if no layers yet (initializing),
    // the layers are just this new layer,
    // and the new layer's context should be the base's
    if ( !this.layers ) {
        this.layers = [newLayer];
        newLayer.canvas = newLayer.base.canvas;
        newLayer.context = newLayer.base.context;
    } else {
        this.layers.push(newLayer);
    }

    // Don't forget to set the new context and currentlayer
    this.currentLayerIndex = this.layers.length;
    this.currentLayer = newLayer;

    this.render();

    return newLayer;

};

Martin.prototype.duplicateLayer = function() {
    this.newLayer( '', this.context.imageData, this.elements );
    return this;
};

Martin.prototype.deleteLayer = function( num ) {

    num = num || this.currentLayerIndex;

    this.container.removeChild(this.layers[num].DOMelement);
    this.layers.splice(num, 1);

    return this;

};

// Clear a layer of pixel data but don't delete it
Martin.prototype.clearLayer = function(which) {

    var original = this.currentLayerIndex;

    if ( which ) this.switchToLayer(which);

    this.context.clearRect(0, 0, this.width(), this.height());

    this.switchToLayer(original);
};

Martin.prototype.switchToLayer = function( num ) {

    this.context = this.layers[num || 0].context;
    this.currentLayer = this.layers[num || 0];
    this.currentLayerIndex = num || 0;

    return this;

};
