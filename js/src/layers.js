/*
    .newLayer()
    .duplicateLayer()
    .deleteLayer()
    .clearLayer()
    .switchToLayer()
    .mergeLayers()
*/

// ----- Layer constructor
Martin.Layer = function(baseCanvas, arg) {

    this.DOMelement = document.createElement('div');
    this.DOMelement.setAttribute('data-martin', '');
    this.DOMelement.setAttribute('data-martin-layer', '');

    this.width = baseCanvas.width;
    this.height = baseCanvas.height;

    this.elements = [];

    if ( typeof arg === 'string' ) {
        this.type = arg;
    } else {
        for ( var i in arg ) this[i] = arg[i];
    }

    return this;

};

// ----- Add an element to a layer
Martin.Layer.prototype.addElement = function(type) {

    var canvas = document.createElement('canvas');

    canvas.width = this.width;
    canvas.height = this.height;

    this.DOMelement.appendChild(canvas);

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.elements.push({
        type: type
    });

    return this.elements.length - 1;

};

// Create a new (top-most) layer and switch to that layer.
// Optional: include pixel data for the new layer
Martin.prototype.newLayer = function(arg, data) {

    var newLayer = new Martin.Layer(this.canvas);

    // if no layers yet (initializing),
    // set layers to an empty array
    // and append canvas to new layer's DOM element
    if ( !this.layers ) {
        this.layers = [];
        newLayer.DOMelement.appendChild(this.canvas);
    }

    this.container.insertBefore( newLayer.DOMelement, this.firstChild );

    // Don't forget to set the new context and currentlayer
    this.context = newLayer.context;
    this.currentLayerIndex = this.layers.length;
    this.currentLayer = newLayer;

    this.layers.push(newLayer);

    return this;

};

Martin.prototype.duplicateLayer = function() {
    this.newLayer( '', this.context.imageData );
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

// Return's a data URL of all the working layers
Martin.prototype.toDataURL = function() {

    var layers = this.layers,
        scratch = document.createElement('canvas'),
        scratchContext = scratch.getContext('2d');

    scratch.width = this.width();
    scratch.height = this.height();

    // loop through layers
    layers.forEach(function(layer, i) {

        // loop through layer children
        if ( layer.DOMelement.children ) {
            Array.prototype.slice.call(layer.DOMelement.children).forEach(function(c) {
                scratchContext.drawImage( c, 0, 0 );
            });
        }
    });

    return scratch.toDataURL();

};
