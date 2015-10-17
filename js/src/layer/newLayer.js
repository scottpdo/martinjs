// Create a new (top-most) layer and switch to that layer.
var Layer = require('./layers.js');

module.exports = function newLayer(arg) {

    var newLayer = new Layer(this, arg);

    this.currentLayer = newLayer;

    this.autorender();

    return newLayer;

};