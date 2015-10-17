/*

    Martin.Element constructor

    Element methods:
    .update()
    .moveTo()
*/

var Obj = require('../object/object.js');

function Element(type, caller, data) {

    var base = caller.base || caller,
        layer = caller.currentLayer || caller;

    // base refers to the instance of Martin
    this.base = base;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    // TODO: bounding box
    this.canvas.width = base.original ? (base.original.naturalWidth || base.original.width) : base.width();
    this.canvas.height = base.original ? (base.original.naturalHeight || base.original.height) : base.height();

    this.scale = {
        x: 1,
        y: 1
    };

    this.data = data || {};
    if ( data.x ) this.data.x = layer.normalizeX(data.x);
    if ( data.y ) this.data.y = layer.normalizeY(data.y);
    this.type = type;
    this.layer = layer;

    this.effects = [];

    this.stack = this.layer.elements;
    this.stack.push(this);

    // automatically push backgrounds to the bottom of the layer
    if ( this.type === 'background' ) {
        this.data = {
            color: data
        };
        this.bumpToBottom();
    }

    return this;
};

Element.prototype = Object.create(Obj.prototype);

// Set the fill, stroke, alpha for a new shape
Element.prototype.setContext = function( obj ) {

    var context = this.context;

    context.save();

    context.fillStyle = obj.color || '#000';
    context.fill();

    context.scale(
        this.scale.x,
        this.scale.y
    );

    context.globalAlpha = obj.alpha || 1;

    context.lineWidth = obj.strokeWidth ? obj.strokeWidth : 0;
    context.lineCap = obj.cap ? obj.cap : 'square';
    context.strokeStyle = obj.stroke ? obj.stroke : 'transparent';
    context.stroke();

    context.restore();

};

// ----- Update an element with new data
Element.prototype.update = function(arg1, arg2) {

    var key, value, data;

    if ( arg2 ) {
        key = arg1;
        value = arg2;
        this.data[key] = value;
    } else {
        for ( key in arg1 ) {
            value = arg1[key];
            this.data[key] = value;
        }
    }

    this.base.autorender();
};

// ----- Move an element to new coordinates
Element.prototype.moveTo = function(x, y) {

    var data = this.data;

    // if no params given, move to 0, 0
    x = x || 0;
    y = y || 0;

    if ( this.type === 'line' ) {
        data.endX += x - data.x;
        data.endY += y - data.y;
    } else if ( this.type === 'polygon' ) {
        data.points.forEach(function(pt, i) {
            if ( i > 0 ) {
                var thisX = pt[0],
                    thisY = pt[1];
                data.points[i] = [
                    thisX + (x - data.points[0][0]),
                    thisY + (y - data.points[0][1])
                ];
            }
        });
        data.points[0] = [x, y];
    }

    data.x = x;
    data.y = y;

    this.base.autorender();

    return this;

};

module.exports = Element;