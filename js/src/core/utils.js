/*
    For (mostly) utility functions that extend Martin prototype.

    extend()
    .remove()
    .render()
    .toDataURL()
    .convertToImage()
*/

function forEach(arr, cb) {
    if (arr) {
        arr.forEach(cb);
    }
}

function noop() {}

Martin.utils.forEach = forEach;
Martin.utils.noop = noop;

var i,
    func,
    funcs = {

// Extend Martin with plugins, if you want
extend: function extend( obj ) {
    for ( var method in obj ) {
        if ( Martin.prototype.hasOwnProperty(method) ) {
            throw new Error('Careful! This method already exists on the Martin prototype. Try a different name after checking the docs: http://martinjs.org');
        } else {
            Martin.prototype[method] = obj[method];
        }
    }
},

remove: function remove() {
    var canvas = this.canvas,
        parent = canvas.parentNode;
    if ( parent ) parent.removeChild(this.canvas);
    return this;
},

// Render: looping through layers, loop through elements
// and render each (with optional callback)
render: function render(cb) {

    var ctx = this.context;

    ctx.clearRect(0, 0, this.width(), this.height());

    Martin.utils.forEach(this.layers, function(layer) {

        layer.clear();

        Martin.utils.forEach(layer.elements, function renderElement(element) {
            element.renderElement && element.renderElement();
        });

        Martin.utils.forEach(layer.effects, function renderEffect(effect) {
            effect.renderEffect && effect.renderEffect();
        });

        ctx.drawImage(layer.canvas, 0, 0);
    });

    if (cb) return cb();

    return this;
},

// Autorender: Only render if the `autorender` option is not false
autorender: function autorender(cb) {
    if ( this.options.autorender !== false ) return this.render(cb);
    return cb ? cb() : null;
},

// Return's a data URL of all the working layers
toDataURL: function toDataURL() {
    return this.canvas.toDataURL();
},

// Get the dataURL of the merged layers of the canvas,
// then turn that into one image
convertToImage: function convertToImage() {

    var dataURL = this.toDataURL(),
        img = document.createElement('img');

    img.src = dataURL;

    this.layers.forEach(function(layer, i){
        this.deleteLayer(i);
    }, this);

    if ( this.container ) this.container.appendChild( img );

}

};

for ( func in funcs ) {
    Martin.prototype[func] = funcs[func];
}
