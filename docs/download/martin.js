(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var registerElement = require('../element/register.js');

// Convert an image to a canvas or just return the canvas.
module.exports = function makeCanvas() {

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    // Create an empty layer
    this.newLayer();

    if ( this.original ) {

        if ( this.original.tagName === 'IMG' ) {

            var canvas = this.canvas,
                context = this.context,
                original = this.original;

            function d() {

                canvas.width = original.naturalWidth;
                canvas.height = original.naturalHeight;

                this.width(canvas.width);
                this.height(canvas.height);

                original.parentNode.insertBefore( canvas, original );
                original.parentNode.removeChild( original );

                // Give that layer some image data (see src/element/image.js)
                Martin.registerElement('image', function(img) {
                    drawImage.call(this, img);
                });

                this.image(original);
            }

            // This should only fire once! Fire if the image is complete,
            // or add a handler for once it has finished loading.
            if ( original.complete ) return d.call(this);
            original.onload = d.bind(this);

        } else if ( this.original.tagName === 'CANVAS' ) {

            this.canvas = this.original;
            this.context = this.original.getContext('2d');
        }
    }

    // only render and execute callback immediately
    // if the original is not an image
    this.autorender();

    return this;
};

},{"../element/register.js":3}],2:[function(require,module,exports){
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
},{"../object/object.js":5}],3:[function(require,module,exports){
var Element = require('./init.js');

module.exports = function registerElement(name, cb) {

    function attachRender(data) {

        // create new element
        var element = new Element(name, this, data);

        // attach render function (callback) --
        // execute with element's data
        element.renderElement = function renderElement() {

            var layer = this.layer,
                context = this.context;

            // clear any image data
            this.clear();

            // scale the context
            context.scale(
                layer.scale.x,
                layer.scale.y
            );

            context.beginPath();

            cb.call(element, this.data);

            this.setContext(this.data);

            context.closePath();

            // undo scaling
            context.scale(
                1 / layer.scale.x,
                1 / layer.scale.y
            );

            // render this element's effects
            Martin.utils.forEach(this.effects, function(effect) {
                effect.renderEffect && effect.renderEffect();
            });

            // draw to layer
            layer.context.drawImage(this.canvas, 0, 0);
        };

        return element;
    }

    Martin.prototype[name] = function registerToBase(data) {
        var el = attachRender.call(this, data);
        this.autorender();
        return el;
    };

    Martin.Layer.prototype[name] = function registerToLayer(data) {
        var el = attachRender.call(this.base, data);
        this.base.autorender();
        return el;
    };
};
},{"./init.js":2}],4:[function(require,module,exports){
/*
    Martin.js: In-browser photo and image editing
    Author: Scott Donaldson
    Contact: scott.p.donaldson@gmail.com
    Twitter: @scottpdonaldson

    ----------------------------------------

    MARTIN
*/

// The great initializer. Pass in a string to select element by ID,
// or an HTMLElement
var Martin = function( val, options ) {

    if ( !(this instanceof Martin) ) return new Martin( val, options );

    // Set the original element, if there is one
    this.original = null;
    if ( typeof val === 'string' ) {
        this.original = document.getElementById(val);
    } else if ( val instanceof HTMLElement ) {
        this.original = val;
    }

    this.options = options || {};

    // Now prepare yourself...
    return this.makeCanvas();
};

Martin.prototype.makeCanvas = require('./core/init.js');

var utils = {};

// var utils = require('./core/utils.js');

for ( var types in utils ) {
    for ( var func in utils[types] ) {
        if ( type === '_private' ) {
            Martin.utils[func] = utils[types][func];
        } else {
            Martin.prototype[func] = utils[types][func];
        }
    }
}

if ( typeof window === 'object' ) {
    window.Martin = Martin;
}

module.exports = Martin;
},{"./core/init.js":1}],5:[function(require,module,exports){
// shared methods for objects: layers, elements, effects

var Obj = function() {};

Obj.prototype.loop = function(cb, put) {

    var width = this.base.width(),
        height = this.base.height();

    var imageData, pixels, len,
        n, x, y,
        r, g, b, a,
        pixel,
        output;

    imageData = this.getImageData();

    if ( imageData ) {

        pixels = imageData.data;
        len = pixels.length;

        for ( var i = 0; i < len; i += 4 ) {

            // xy coordinates
            n = i / 4;
            x = n % width;
            y = Math.floor(n / width);

            // rgba values
            r = pixels[i];
            g = pixels[i + 1];
            b = pixels[i + 2];
            a = pixels[i + 3];

            // pass an object corresponding to the pixel to the callback
            pixel = { r: r, g: g, b: b, a: a };

            // execute the callback within the context of this layer's, uh... context
            output = cb.call( this.context, x, y, pixel );

            // reassign the actual rgba values of the pixel based on the output from the loop
            pixels[i] = output.r;
            pixels[i + 1] = output.g;
            pixels[i + 2] = output.b;
            pixels[i + 3] = output.a;

        }

        // explicitly declare if image data from callback is not to be used
        if ( put !== false ) this.putImageData( imageData );

    }

    return this;
};

Obj.prototype.getImageData = function() {
    var imageData = this.context && this.canvas.width > 0 && this.canvas.height > 0 ?
        this.context.getImageData(0, 0, this.canvas.width, this.canvas.height) :
        null;
    return imageData;
};

// Simple shell for putting image data
Obj.prototype.putImageData = function(imageData) {
    this.context.putImageData( imageData, 0, 0 );
    return this;
};

Obj.prototype.clear = function clear() {
    this.context.clearRect(0, 0, this.base.width(), this.base.height());
    return this;
};

Obj.prototype.stackIndex = function() {
    return this.stack.indexOf(this);
};

Obj.prototype.remove = function() {
    this.stack.splice(this.stackIndex(), 1);
    this.base.autorender();
    return this;
};

Obj.prototype.bump = function(i) {
    var index = this.stackIndex();
    this.remove();
    this.stack.splice(index + i, 0, this);
    this.base.autorender();
    return this;
};

Obj.prototype.bumpUp = function() {
    return this.bump(1);
};

Obj.prototype.bumpDown = function() {
    return this.bump(-1);
};

Obj.prototype.bumpToTop = function() {
    this.remove();
    this.stack.push(this);
    this.base.autorender();
    return this;
};

Obj.prototype.bumpToBottom = function() {
    this.remove();
    this.stack.unshift(this);
    this.base.autorender();
    return this;
};

module.exports = Obj;
},{}]},{},[4]);
