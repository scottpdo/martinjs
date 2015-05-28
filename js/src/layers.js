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

    // don't delete if the only layer
    if ( this.layers.length > 1 ) {

        num = num || this.currentLayerIndex;

        this.container.removeChild(this.layers[num].canvas);
        this.layers.splice(num, 1);

    } else {
        throw new Error("Can't delete the only layer.");
    }

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

// If `preserve` is true, returns a dataURL of the merged image data,
// otherwise actually merges all the layers onto the lowest layer
Martin.prototype.mergeLayers = function( preserve ) {

    var layers = this.layers,
        aboveLayer,
        belowLayer,
        belowLayerContext,
        aboveCanvas;

    function mergeDown(index) {

        if ( index > 0 ) {

            belowLayer = layers[index - 1];
            belowLayerContext = belowLayer.context;

            aboveLayer = layers[index];
            aboveCanvas = layers[index].canvas;

            // put the new data onto the target layer
            belowLayerContext.drawImage( aboveCanvas, 0, 0 );

            // Remove the old layer from the DOM and update the this.layers array
            this.container.removeChild( layers[index].canvas );
            layers.pop();

            return mergeDown.call( this, index - 1 );
        }
    }

    if ( preserve ) {

        var i = 0;

        belowLayer = document.createElement('canvas');
        belowLayerContext = belowLayer.getContext('2d');

        belowLayer.setAttribute('width', this.width());
        belowLayer.setAttribute('height', this.height());

        while ( i < layers.length ) {

            belowLayerContext.drawImage( layers[i].canvas, 0, 0 );

            i++;
        }

    } else {
        mergeDown.call( this, layers.length - 1 );
    }

    return preserve ? belowLayer.toDataURL() : this;

};
