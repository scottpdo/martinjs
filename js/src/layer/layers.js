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

    this.elements = [];
    this.effects = [];

    // if no layers yet (initializing),
    // the layers are just this new layer,
    // and the new layer's context should be the base's
    if ( !this.base.layers ) {
        this.base.layers = [];
    }
    this.stack = this.base.layers;
    this.stack.push(this);

    if ( typeof arg === 'string' ) {
        this.type = arg;
    } else {
        for ( var i in arg ) this[i] = arg[i];
    }

    return this;

};

Martin.Layer.prototype = Object.create(Martin.Object.prototype);

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

// Create a new (top-most) layer and switch to that layer.
Martin.prototype.newLayer = function(arg) {

    var newLayer = new Martin.Layer(this, arg);

    this.currentLayer = newLayer;

    this.autorender();

    return newLayer;

};

// Switch the context and return the requested later
Martin.prototype.layer = function( num ) {

    this.currentLayer = this.layers[num || 0];

    return this.layers[num || 0];

};
