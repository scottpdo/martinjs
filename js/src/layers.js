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
