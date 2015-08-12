/*
    For utility functions that do extend Martin prototype.

    extend()
    .remove()
    .render()
    .toDataURL()
    .convertToImage()
*/

Martin.utils = {};

// Extend Martin with plugins, if you want
Martin.utils.extend = function( obj ) {
    for ( var method in obj ) {
        Martin.prototype[method] = obj[method];
    }
};

Martin.extend = Martin.utils.extend;

Martin.utils.forEach = function(arr, cb) {
    if (arr) {
        arr.forEach(cb);
    }
};

Martin.utils.noop = function() {};

Martin.prototype.remove = function() {
    var canvas = this.canvas,
        parent = canvas.parentNode;
    if ( parent ) parent.removeChild(this.canvas);
    return this;
};

// Render: looping through layers, loop through elements
// and render each (with optional callback)
Martin.prototype.render = function(cb) {

    Martin.utils.forEach(this.layers, function(layer, i) {

        layer.clear();

        Martin.utils.forEach(layer.elements, function(element) {
            element.renderElement();
        });

        Martin.utils.forEach(layer.effects, function(effect) {
            effect.renderEffect();
        });

        layer.render();
    });

    if (cb) return cb();

    return this;
};

// Autorender: Only render if the `autorender` option is not false
Martin.prototype.autorender = function(cb) {
    if ( this.options.autorender !== false ) return this.render(cb);
    return cb ? cb() : null;
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

    if ( this.container ) this.container.appendChild( img );

};
