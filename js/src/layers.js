/*
    .newLayer()
    .duplicateLayer()
    .deleteLayer()
    .clearLayer()
    .switchToLayer()
    .mergeLayers()
*/


// Create a new (top-most) layer and switch to that layer.
// Optional: include pixel data for the new layer
Martin.prototype.newLayer = function(arg, data) {

    var newCanvas = document.createElement('canvas'),
        layerObject = {};

    newCanvas.width = this.canvas.width;
    newCanvas.height = this.canvas.height;

    this.container.appendChild( newCanvas );

    // Don't forget to set the new context and currentlayer
    this.context = newCanvas.getContext('2d');
    this.currentLayer = this.layers.length;

    // if there is data for the new layer, put it now
    if ( data ) this.context.putImageData(data, 0, 0);

    layerObject.canvas = newCanvas;
    layerObject.context = this.context;

    if ( typeof arg === 'string' ) {
        layerObject.type = arg;
    } else {
        for ( var i in arg ) layerObject[i] = arg[i];
    }

    this.layers.push(layerObject);

    return this;

};

Martin.prototype.duplicateLayer = function() {
    this.newLayer( '', this.context.imageData );
    return this;
};

Martin.prototype.deleteLayer = function( num ) {

    // don't delete if the only layer
    if ( this.layers.length > 1 ) {

        num = num || this.currentLayer;

        this.container.removeChild(this.layers[num].canvas);
        this.layers.splice(num, 1);

    } else {
        throw new Error("Can't delete the only layer.");
    }

    return this;

};

// Clear a layer of pixel data but don't delete it
Martin.prototype.clearLayer = function(which) {

    var original = this.currentLayer;

    if ( which ) this.switchToLayer(which);

    this.context.clearRect(0, 0, this.width(), this.height());

    this.switchToLayer(original);
};

Martin.prototype.switchToLayer = function( num ) {

    this.context = this.layers[num || 0].context;
    this.currentLayer = num || 0;

    return this;

};

// Merge layers. TODO: If given an array i.e. [0, 1, 2, 3], merge those onto the lowest layer.
// Otherwise merge all the layers and return a single canvas.
Martin.prototype.mergeLayers = function( layers ) {

    if ( !layers ) layers = this.layers;

    var _this = this;

    function mergeDown(index) {

        if ( index > 0 ) {

            var aboveLayer = layers[index],
                belowLayer = layers[index - 1],
                aboveCanvas = layers[index].canvas;

            // put the new data onto the target layer
            belowLayer.context.drawImage( aboveCanvas, 0, 0 );

            // Remove the old layer from the DOM and update the this.layers array
            _this.container.removeChild( layers[index].canvas );
            layers.pop();

            return mergeDown( index - 1 );
        }
    }

    mergeDown( layers.length - 1 );

    return this;

};
