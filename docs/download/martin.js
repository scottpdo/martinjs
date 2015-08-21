/*
    Martin.js: In-browser photo and image editing
    Author: Scott Donaldson
    Contact: scott.p.donaldson@gmail.com
    Twitter: @scottpdonaldson

    ----------------------------------------

    MARTIN
*/

(function() {

// The great initializer. Pass in a string to select element by ID,
// or an HTMLElement
function Martin( val, options ) {

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

Martin.utils = {};

// Convert an image to a canvas or just return the canvas.
Martin.prototype.makeCanvas = function() {

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

Martin._version = '0.3.3';

/*
    For helper functions that don't extend Martin prototype.

    degToRad()
    radToDeg()
    hexToRGB()
*/

Martin.degToRad = function(deg) {
    return deg * ( Math.PI / 180 );
};

Martin.radToDeg = function(rad) {
    return rad * ( 180 / Math.PI );
};

Martin.hexToRGB = function( hex ) {

    if ( !hex ) { return false; }

    if ( hex.slice(0, 1) === '#' ) { hex = hex.slice(1); }

    var r, g, b;

    if ( hex.length === 6 ) {

        r = hex.slice(0, 2);
        g = hex.slice(2, 4);
        b = hex.slice(4, 6);

    } else if ( hex.length === 3 ) {

        r = hex.slice(0, 1) + hex.slice(0, 1);
        g = hex.slice(1, 2) + hex.slice(1, 2);
        b = hex.slice(2, 3) + hex.slice(2, 3);

    }

    return {
        r: parseInt(r, 16),
        g: parseInt(g, 16),
        b: parseInt(b, 16)
    };

};

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

// shared methods for objects: layers, elements, effects

Martin.Object = function() {};
var ObjMethods,
    ObjMethod;

ObjMethods = {

    loop: function(cb, put) {

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
    },

    getImageData: function() {
        var imageData = this.context && this.canvas.width > 0 && this.canvas.height > 0 ?
            this.context.getImageData(0, 0, this.canvas.width, this.canvas.height) :
            null;
        return imageData;
    },

    // Simple shell for putting image data
    putImageData: function(imageData) {
        this.context.putImageData( imageData, 0, 0 );
        return this;
    },

    clear: function clear() {
        this.context.clearRect(0, 0, this.base.width(), this.base.height());
        return this;
    },

    stackIndex: function() {
        return this.stack.indexOf(this);
    },

    remove: function() {
        this.stack.splice(this.stackIndex(), 1);
        this.base.autorender();
        return this;
    },

    bump: function(i) {
        var index = this.stackIndex();
        this.remove();
        this.stack.splice(index + i, 0, this);
        this.base.autorender();
        return this;
    },

    bumpUp: function() {
        return this.bump(1);
    },

    bumpDown: function() {
        return this.bump(-1);
    },

    bumpToTop: function() {
        this.remove();
        this.stack.push(this);
        this.base.autorender();
        return this;
    },

    bumpToBottom: function() {
        this.remove();
        this.stack.unshift(this);
        this.base.autorender();
        return this;
    },
};

for ( ObjMethod in ObjMethods ) {
    Martin.Object.prototype[ObjMethod] = ObjMethods[ObjMethod];
}

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

/*

    Martin.Element constructor

    Element methods:
    .update()
    .moveTo()
*/

function registerElement(name, cb) {

    function attachRender(data) {

        // create new element
        var element = new Martin.Element(name, this, data);

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

Martin.registerElement = registerElement;

Martin.Element = function(type, caller, data) {

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

Martin.Element.prototype = Object.create(Martin.Object.prototype);

// Set the fill, stroke, alpha for a new shape
Martin.Element.prototype.setContext = function( obj ) {

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
Martin.Element.prototype.update = function(arg1, arg2) {

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
Martin.Element.prototype.moveTo = function(x, y) {

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

function drawImage(img) {
    this.context.drawImage( img, 0, 0 );
}

registerElement('image', function(img) {
    drawImage.call(this, img);
});

function rect(data) {

    var layer = this.layer,
        context = this.context;

    context.rect(
        layer.normalizeX( data.x || 0 ),
        layer.normalizeY( data.y || 0 ),
        layer.normalizeX( data.width || layer.width() ),
        layer.normalizeY( data.height || layer.height() )
    );
}

registerElement('rect', function(data) {
    rect.call(this, data);
});

registerElement('background', function(data) {
    rect.call(this, data);
});

registerElement('line', function(data) {

    var layer = this.layer,
        context = this.context;

    context.moveTo(
        layer.normalizeX( data.x || 0 ),
        layer.normalizeY( data.y || 0 )
    );

    context.lineTo(
        layer.normalizeX( data.endX ),
        layer.normalizeY( data.endY )
    );

    if ( !data.strokeWidth ) data.strokeWidth = 1;
    data.stroke = data.color ? data.color : '#000';

    return this;
});

registerElement('circle', function(data) {

    var layer = this.layer,
        context = this.context,
        centerX = layer.normalizeX( data.x || 0 ),
        centerY = layer.normalizeY( data.y || 0 );

    context.arc( centerX, centerY, data.radius, 0, 2 * Math.PI, false);

});

registerElement('ellipse', function(data) {

    var layer = this.layer,
        context = this.context,
        centerX = layer.normalizeX( data.x || 0 ),
        centerY = layer.normalizeY( data.y || 0 ),
        scale;

    if ( data.radiusX > data.radiusY ) {

        scale = data.radiusX / data.radiusY;

        context.scale( scale, 1 );

        context.arc( centerX / scale, centerY, data.radiusX / scale, 0, 2 * Math.PI, false);

        context.scale( 1 / scale, 1 );

    } else {

        scale = data.radiusY / data.radiusX;

        context.scale( 1, scale );

        context.arc( centerX, centerY / scale, data.radiusY / scale, 0, 2 * Math.PI, false);

        context.scale( 1, 1 / scale );

    }

    return this;
});

registerElement('polygon', function(data) {

    var layer = this.layer,
        context = this.context;

    for ( var i = 0; i < data.points.length; i++ ) {

        var x = data.points[i][0],
            y = data.points[i][1],
            toX = layer.normalizeX( x ),
            toY = layer.normalizeY( y );

        if ( i === 0 ) context.moveTo( toX, toY );

        context.lineTo( toX, toY );

    }

    // close the path
    context.lineTo(
        layer.normalizeX(data.points[0][0]),
        layer.normalizeY(data.points[0][1])
    );

    return this;
});

registerElement('text', function(data) {

	var layer = this.layer,
        context = this.context,
		size,
        style,
        font,
        fontOutput;

    var clone = {};

    // use custom getters and setters for these properties
    style = data.style || '';
    size = data.size || '';
    font = data.font || '';

    function fontString(style, size, font) {
        return (style ? style + ' ' : '') + (size || 16) + 'px ' + (font || 'sans-serif');
    };

    fontOutput = fontString(data.style, data.size, data.font);

    this.fontSize = function(size) {
        if ( size ) {
            this.data.size = size;
            return size;
        } else {
            return this.data.size;
        }
    };

    this.fontStyle = function(style) {
        if ( style ) {
            this.data.style = style;
            return style;
        }

        return this.data.style;
    };

    this.font = function(font) {
        if ( font ) {
            this.data.font = font;
            return font;
        }

        return this.data.style;
    };

    this.width = function() {
        return context.measureText(data.text || '').width;
    };

    Object.defineProperty(clone, 'theStyle', {
        get: function() {
            return style;
        },
        set: function(style) {
            fontOutput = fontString(style, data.size, data.font);
        }
    });

    Object.defineProperty(clone, 'theSize', {
        get: function() {
            return size;
        },
        set: function(size) {
            fontOutput = fontString(data.style, size, data.font);
        }
    });

    Object.defineProperty(clone, 'theFont', {
        get: function() {
            return font;
        },
        set: function(font) {
            fontOutput = fontString(data.style, data.size, font);
        }
    });

	context.font = fontOutput;
	context.fillStyle = data.color || '#000';
	context.textBaseline = 'top';
	context.textAlign = data.align || 'left';
	context.fillText(
		data.text || '',
		layer.normalizeX(data.x || 0),
		layer.normalizeY(data.y || 0)
	);
});

/*

    Martin.Effect constructor

    Effect methods:
    .increase()
    .decrease()
*/

function registerEffect(name, cb) {

    function attachRender(data, stack, stackContainer) {

        // create new effect
        var effect = new Martin.Effect(name, this, data, stack, stackContainer);

        // attach render function (callback) --
        // execute with effect's data
        effect.renderEffect = function renderEffect() {
            cb.call(effect, this.data);
        };

        return effect;
    }

    Martin.prototype[name] = function attachToBase(data) {
        var effect = attachRender.call(this, data, this.currentLayer.effects, this.currentLayer);
        this.autorender();
        return effect;
    };

    Martin.Layer.prototype[name] =
    Martin.Element.prototype[name] = function attachToLayerOrElement(data) {
        var effect = attachRender.call(this.base, data, this.effects, this);
        this.base.autorender();
        return effect;
    };
};

Martin.registerEffect = registerEffect;

Martin.Effect = function(type, base, data, stack, stackContainer) {

    this.base = base;
    this.type = type;

    this.data = data;

    this.context = stackContainer;

    this.stack = stack;
    this.stack.push(this);

    return this;
};

Martin.Effect.prototype = Object.create(Martin.Object.prototype);

// Adjust the intensity of an Effect (linear effects only)
Martin.Effect.prototype.increase = function(amt) {

    if ( typeof this.data === 'number' ) {
        this.data += amt || 1;
        this.base.autorender();
    }

    return this;
};

Martin.Effect.prototype.decrease = function(amt) {
    return this.increase(-amt || -1);
};

// Desaturate
function desaturate(amt) {

    this.context.loop(function(x, y, pixel) {

        var r = pixel.r,
            g = pixel.g,
            b = pixel.b;

        var grayscale = r * 0.3 + g * 0.59 + b * 0.11;
            r = (1 - amt) * r + amt * grayscale;        // red
            g = (1 - amt) * g + amt * grayscale;        // green
            b = (1 - amt) * b + amt * grayscale;        // blue

        pixel.r = r;
        pixel.g = g;
        pixel.b = b;

        return pixel;

    });
}

registerEffect('desaturate', function(amt) {
    amt = amt / 100;
    desaturate.call(this, amt);
});

// inverse of saturate
registerEffect('saturate', function(amt) {
    amt = -amt / 100;
    desaturate.call(this, amt);
});

// Lighten and darken. (Darken just returns the opposite of lighten).
// Takes an input from 0 to 100. Higher values return pure white or black.
function lighten(amt) {

    this.context.loop(function(x, y, pixel) {

        pixel.r += Math.round(amt * 255);
        pixel.g += Math.round(amt * 255);
        pixel.b += Math.round(amt * 255);

        return pixel;
    });
}

registerEffect('lighten', function(amt) {
    amt = amt / 100;
    lighten.call(this, amt);
});

registerEffect('darken', function(amt) {
    amt = -amt / 100;
    lighten.call(this, amt);
});

// Fade uniform
registerEffect('opacity', function(amt) {

    amt = amt / 100;

    var base = this.base;

    this.context.loop(function(x, y, pixel) {
        pixel.a *= amt;
        return pixel;
    });
});

/*
 *
 * StackBlur Algorithm Copyright (c) 2010 Mario Klingemann
 * Version: 0.6
 * Author:	Mario Klingemann
 * Contact: mario@quasimondo.com
 * Website:	http://www.quasimondo.com/StackBlurForCanvas
 * Twitter:	@quasimondo
 *
 */

// simple stack maker
function BlurStack() {
    this.r = this.g = this.b = this.a = 0;
    this.next = null;
}

// helper functions for .blur()
BlurStack.mul_shift_table = function(i) {
    var mul_table = [1,171,205,293,57,373,79,137,241,27,391,357,41,19,283,265,497,469,443,421,25,191,365,349,335,161,155,149,9,278,269,261,505,245,475,231,449,437,213,415,405,395,193,377,369,361,353,345,169,331,325,319,313,307,301,37,145,285,281,69,271,267,263,259,509,501,493,243,479,118,465,459,113,446,55,435,429,423,209,413,51,403,199,393,97,3,379,375,371,367,363,359,355,351,347,43,85,337,333,165,327,323,5,317,157,311,77,305,303,75,297,294,73,289,287,71,141,279,277,275,68,135,67,133,33,262,260,129,511,507,503,499,495,491,61,121,481,477,237,235,467,232,115,457,227,451,7,445,221,439,218,433,215,427,425,211,419,417,207,411,409,203,202,401,399,396,197,49,389,387,385,383,95,189,47,187,93,185,23,183,91,181,45,179,89,177,11,175,87,173,345,343,341,339,337,21,167,83,331,329,327,163,81,323,321,319,159,79,315,313,39,155,309,307,153,305,303,151,75,299,149,37,295,147,73,291,145,289,287,143,285,71,141,281,35,279,139,69,275,137,273,17,271,135,269,267,133,265,33,263,131,261,130,259,129,257,1];


    var shg_table = [0,9,10,11,9,12,10,11,12,9,13,13,10,9,13,13,14,14,14,14,10,13,14,14,14,13,13,13,9,14,14,14,15,14,15,14,15,15,14,15,15,15,14,15,15,15,15,15,14,15,15,15,15,15,15,12,14,15,15,13,15,15,15,15,16,16,16,15,16,14,16,16,14,16,13,16,16,16,15,16,13,16,15,16,14,9,16,16,16,16,16,16,16,16,16,13,14,16,16,15,16,16,10,16,15,16,14,16,16,14,16,16,14,16,16,14,15,16,16,16,14,15,14,15,13,16,16,15,17,17,17,17,17,17,14,15,17,17,16,16,17,16,15,17,16,17,11,17,16,17,16,17,16,17,17,16,17,17,16,17,17,16,16,17,17,17,16,14,17,17,17,17,15,16,14,16,15,16,13,16,15,16,14,16,15,16,12,16,15,16,17,17,17,17,17,13,16,15,17,17,17,16,15,17,17,17,16,15,17,17,14,16,17,17,16,17,17,16,15,17,16,14,17,16,15,17,16,17,17,16,17,15,16,17,14,17,16,15,17,16,17,13,17,16,17,17,16,17,14,17,16,17,16,17,16,17,9];

    return [ mul_table[i] || mul_table[mul_table.length - 1], shg_table[i] || shg_table[shg_table.length - 1] ];
};

// And, what we've all been waiting for:
registerEffect('blur', function(amt) {

    if ( isNaN(amt) || amt < 1 ) return this;
    // Round to nearest pixel
    amt = Math.round(amt);

    var iterations = 2,			// increase for smoother blurring
        width = this.base.width(),
        height = this.base.height(),
        widthMinus1 = width - 1,
        heightMinus1 = height - 1,
        radiusPlus1 = amt + 1,
        div = 2 * amt + 1,
        mul_sum = BlurStack.mul_shift_table(amt)[0],
        shg_sum = BlurStack.mul_shift_table(amt)[1];

    var it = iterations, // internal iterations in case doing multiple layers
        imageData = this.context.getImageData();

    if ( imageData ) {
        var pixels = imageData.data;

        var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
            r_out_sum, g_out_sum, b_out_sum, a_out_sum,
            r_in_sum, g_in_sum, b_in_sum, a_in_sum,
            pr, pg, pb, pa;

        var stackStart = new BlurStack(),
            stack = stackStart,
            stackEnd,
            stackIn;

        for ( i = 1; i < div; i++ ) {
            stack = stack.next = new BlurStack();
            if ( i === radiusPlus1 ) stackEnd = stack;
        }

        stack.next = stackStart;
        stackIn = null;

        // repeat for as many iterations as given
        while ( it-- > 0 ) {

            yw = yi = 0;

            // loop through rows from top down
            for ( y = height; --y > -1; ) {

                // start summing pixel values
                r_sum = radiusPlus1 * ( pr = pixels[yi] );
                g_sum = radiusPlus1 * ( pg = pixels[yi + 1] );
                b_sum = radiusPlus1 * ( pb = pixels[yi + 2] );
                a_sum = radiusPlus1 * ( pa = pixels[yi + 3] );

                stack = stackStart;

                for ( i = radiusPlus1; --i > -1; ) {
                    stack.r = pr;
                    stack.g = pg;
                    stack.b = pb;
                    stack.a = pa;

                    stack = stack.next;
                }

                for ( i = 1; i < radiusPlus1; i++ ) {

                    p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );

                    r_sum += ( stack.r = pixels[p]);
                    g_sum += ( stack.g = pixels[p + 1]);
                    b_sum += ( stack.b = pixels[p + 2]);
                    a_sum += ( stack.a = pixels[p + 3]);

                    stack = stack.next;
                }

                stackIn = stackStart;

                for ( x = 0; x < width; x++ ) {
                    pixels[yi++] = (r_sum * mul_sum) >>> shg_sum;
                    pixels[yi++] = (g_sum * mul_sum) >>> shg_sum;
                    pixels[yi++] = (b_sum * mul_sum) >>> shg_sum;
                    pixels[yi++] = (a_sum * mul_sum) >>> shg_sum;

                    p = ( yw + ( ( p = x + amt + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

                    r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
                    g_sum -= stackIn.g - ( stackIn.g = pixels[p + 1]);
                    b_sum -= stackIn.b - ( stackIn.b = pixels[p + 2]);
                    a_sum -= stackIn.a - ( stackIn.a = pixels[p + 3]);

                    stackIn = stackIn.next;
                }

                // next row
                yw += width;
            }

            for ( x = 0; x < width; x++ ) {

                // with each column, divide yi by 4 (4 values per px)
                yi = x << 2;

                r_sum = radiusPlus1 * ( pr = pixels[yi]);
                g_sum = radiusPlus1 * ( pg = pixels[yi + 1]);
                b_sum = radiusPlus1 * ( pb = pixels[yi + 2]);
                a_sum = radiusPlus1 * ( pa = pixels[yi + 3]);

                stack = stackStart;

                for ( i = 0; i < radiusPlus1; i++ ) {
                    stack.r = pr;
                    stack.g = pg;
                    stack.b = pb;
                    stack.a = pa;
                    stack = stack.next;
                }

                yp = width;

                for ( i = 1; i <= amt; i++ ) {
                    yi = ( yp + x ) << 2;

                    r_sum += ( stack.r = pixels[yi]);
                    g_sum += ( stack.g = pixels[yi + 1]);
                    b_sum += ( stack.b = pixels[yi + 2]);
                    a_sum += ( stack.a = pixels[yi + 3]);

                    stack = stack.next;

                    if ( i < heightMinus1 ) yp += width;
                }

                yi = x;
                stackIn = stackStart;

                for ( y = 0; y < height; y++ ) {

                    p = yi << 2;

                    pixels[p + 3] = pa =(a_sum * mul_sum) >>> shg_sum;

                    if ( pa > 0 ) {
                        pa = 255 / pa;
                        pixels[p]   = ((r_sum * mul_sum) >>> shg_sum ) * pa;
                        pixels[p + 1] = ((g_sum * mul_sum) >>> shg_sum ) * pa;
                        pixels[p + 2] = ((b_sum * mul_sum) >>> shg_sum ) * pa;
                    } else {
                        pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
                    }

                    p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

                    r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
                    g_sum -= stackIn.g - ( stackIn.g = pixels[p + 1]);
                    b_sum -= stackIn.b - ( stackIn.b = pixels[p + 2]);
                    a_sum -= stackIn.a - ( stackIn.a = pixels[p + 3]);

                    stackIn = stackIn.next;

                    yi += width;
                }
            }
        }

        this.context.putImageData( imageData );
    }
});

Martin.registerEffect('invert', function() {
    this.context.loop(function(x, y, pixel) {
        pixel.r = 255 - pixel.r;
        pixel.g = 255 - pixel.g;
        pixel.b = 255 - pixel.b;

        return pixel;
    });
});

var events = ['click', 'mouseover', 'mousemove', 'mouseenter', 'mouseleave', 'mouseout', 'mousedown', 'mouseup'];

function EventCallback(base, cb, type) {
    return {
        exec: function exec(e) {

            var eventObj = {}, k;

            for ( k in e ) {
                eventObj[k] = e[k];
            }

            eventObj.x = e.offsetX ? e.offsetX : e.clientX - base.canvas.getBoundingClientRect().left;
            eventObj.y = e.offsetY ? e.offsetY : e.clientY - base.canvas.getBoundingClientRect().top;

            cb(eventObj);
            base.autorender();
        }
    };
}

events.forEach(function(evt){
    Martin.prototype[evt] = function(cb) {

        var callback = EventCallback(this, cb, evt);

        this.canvas.addEventListener(evt, callback.exec);
        return this;
    };
});

Martin.prototype.on = function(evt, cb) {

    evt = evt.split(' ');

    evt.forEach(function(ev) {
        var callback = EventCallback(this, cb, ev);
        if ( events.indexOf(ev) > -1 ) {
            this.canvas.addEventListener(ev, callback.exec);
        }
    }, this);

    return this;
};

/*
	Need to find a place for the rest of these important methods.

	.width()
	.height()
*/

// Set or change dimensions.
[ 'width', 'height' ].forEach(function( which ) {

	Martin.prototype[which] = function( val, resize ) {

		// if no value given, return the corresponding value
		if ( !val ) return this.canvas[which];

		// Update height or width of all the layers' canvases
		// and update their contexts
		this.canvas[which] = val;
		this.layers.forEach(function(layer) {
			layer[which](val, resize);
		});

		return this;

	};

	Martin.Layer.prototype[which] = function(val, resize) {

		var ratio;

		if ( !val ) return this.canvas[which];

		// normalize the value
		val = this['normalize' + (which === 'width' ? 'X' : 'Y')](val);

		// resize element canvases
		Martin.utils.forEach(this.elements, function(element) {
			element.canvas[which] = val;
		});

		// get the ratio, in case we're resizing
		ratio = resize ? val / this.canvas[which] : 1;

		if ( resize ) {

			if ( which === 'width' ) this.scale.x *= ratio;
			if ( which === 'height' ) this.scale.y *= ratio;

			this.canvas[which] = val;
		}

		this.base.autorender();

		return this;
	};
});

this.Martin = Martin;

})();
