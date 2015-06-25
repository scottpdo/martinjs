/*
    Martin.js: In-browser photo and image editing
    Author: Scott Donaldson
    Contact: scott.p.donaldson@gmail.com
    Twitter: @scottpdonaldson

    ----------------------------------------

    MARTIN
    .makeCanvas()
    _version
*/

// The great initializer. Pass in a string to select element by ID,
// or an HTMLElement
window.Martin = function( val ) {

    if ( !(this instanceof Martin) ) return new Martin( val );

    // Set the original element, if there is one
    this.original = null;
    if ( typeof val === 'string' ) {
        this.original = document.getElementById(val);
    } else if ( val instanceof HTMLElement ) {
        this.original = val;
    }

    // Now prepare yourself...
    return this.makeCanvas();

};

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

                // Give that layer some image data
                new Martin.Element('image', this, {
                    original: original
                });
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
    this.render();

    return this;
};

// DON'T EDIT THIS LINE.
// Automatically updated w/ Gulp
Martin._version = '0.2.4';

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
    .addElement()

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

    if ( typeof arg === 'string' ) {
        this.type = arg;
    } else {
        for ( var i in arg ) this[i] = arg[i];
    }

    return this;

};

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

// Loop through the image data
Martin.Layer.prototype.loop = function(cb, put) {

    var width = this.base.width(),
        height = this.base.height();

    var imageData = this.getImageData(),
        pixels = imageData.data,
        len = pixels.length,
        n,
        x,
        y,
        r, g, b, a,
        pixel,
        output;

    for ( var i = 0; i < len; i += 4 ) {

        // xy coordinates
        n = i / 4;
        x = n % width;
        y = Math.floor(n / height);

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

    return this;
};

// Set the fill, stroke, alpha for a new shape
Martin.Layer.prototype.setContext = function( obj ) {

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


Martin.Layer.prototype.getImageData = function() {
    var imageData = this.context ? this.context.getImageData(0, 0, this.canvas.width, this.canvas.height) : null;
    return imageData;
};

// Simple shell for putting image data
Martin.Layer.prototype.putImageData = function(imageData) {
    this.context.putImageData( imageData, 0, 0 );
    return this;
};

Martin.Layer.prototype.render = function() {
    var base = this.base,
        imageData = this.getImageData();
    // only draw if there is a context for the base --
    // if the <img> or <canvas> hasn't fully initialized
    // this won't run
    if ( base.context ) base.context.drawImage( this.canvas, 0, 0 );
};

Martin.Layer.prototype.clear = function() {
    this.context.clearRect(0, 0, this.base.width(), this.base.height());
    return this;
};

Martin.Layer.prototype.remove = function() {
    this.base.layers.splice(this.base.layers.indexOf(this), 1);
    this.base.render();
    return this;
};

// ----- Add an element to a layer
Martin.Layer.prototype.addElement = function(element) {

    if ( !(element instanceof Martin.Element ) ) {
        throw new Error('When adding an element to a layer, it must be created from Martin.Element.');
    }

    if (this.elements) {
        this.elements.push(element);
    } else {
        this.elements = [element];
    }

    return this;
};

// Create a new (top-most) layer and switch to that layer.
Martin.prototype.newLayer = function(arg) {

    var newLayer = new Martin.Layer(this, arg);

    // if no layers yet (initializing),
    // the layers are just this new layer,
    // and the new layer's context should be the base's
    if ( !this.layers ) {
        this.layers = [newLayer];
    } else {
        this.layers.push(newLayer);
    }

    // Don't forget to set the new context and currentlayer
    this.currentLayerIndex = this.layers.length - 1;
    this.currentLayer = newLayer;

    this.render();

    return newLayer;

};

// Switch the context and return the requested later
Martin.prototype.layer = function( num ) {

    this.context = this.layers[num || 0].context;
    this.currentLayer = this.layers[num || 0];
    this.currentLayerIndex = num || 0;

    return this.layers[num || 0];

};

/*

    Martin.Element constructor

    Elements:
    .background()
    .line()
    .rect()
    .circle()
    .ellipse()
    .polygon()
    .text()

    Element methods:
    .layerIndex()
    .remove()
    .bump()
    .bumpUp()
    .bumpDown()
    .bumpToTop()
    .bumpToBottom()
    .moveTo()

    Finally:
    - Loop through Elements and
      create a corresponding method on the main Martin instance
*/

Martin.Element = function(type, canvas, obj) {

    if ( Martin.Element.prototype.hasOwnProperty(type) ) {

        // adds a new canvas within the current layer
        var layer = canvas.currentLayer;

        // base refers to the instance of Martin
        this.base = canvas;

        this.data = obj;
        this.type = type;
        this.layer = layer;

        layer.addElement(this);

        // automatically push backgrounds to the bottom of the layer
        if ( this.type === 'background' ) this.bumpToBottom();

        this.base.render();

        return this;

    } else {

        throw new Error('Given type is not an allowed element.');
    }
};

Martin.Element.prototype.renderElement = function() {

    var layer = this.layer,
        context = layer.context;

    // scale the context
    context.scale(
        layer.scale.x,
        layer.scale.y
    );

    // render the element
    this[this.type]();

    // undo scaling
    context.scale(
        1 / layer.scale.x,
        1 / layer.scale.y
    );

    return this;
};

Martin.Element.prototype.image = function() {

    var layer = this.layer,
        context = layer.context,
        obj = this.data;

    context.drawImage( obj.original, 0, 0 );

    return this;
};

Martin.Element.prototype.background = function() {

    var color = typeof this.data === 'string' ? this.data : this.data.color,
        obj = {};

    obj.color = color;
    this.data = obj;

    return this.rect();
};


Martin.Element.prototype.line = function() {

    var layer = this.layer,
        context = layer.context,
        obj = this.data;

    context.beginPath();

    context.moveTo(
        layer.normalizeX( obj.x || 0 ),
        layer.normalizeY( obj.y || 0 )
    );

    context.lineTo(
        layer.normalizeX( obj.endX ),
        layer.normalizeY( obj.endY )
    );

    obj.width = Math.abs(obj.endX - obj.x);
    obj.height = Math.abs(obj.endY - obj.y);

    if ( !obj.strokeWidth ) obj.strokeWidth = 1;
    obj.stroke = obj.color ? obj.color : '#000';

    layer.setContext( obj );

    context.closePath();

    return this;

};

Martin.Element.prototype.rect = function() {

    var layer = this.layer,
        context = layer.context,
        obj = this.data;

    context.beginPath();

    context.rect(
        layer.normalizeX( obj.x || 0 ),
        layer.normalizeY( obj.y || 0 ),
        layer.normalizeX( obj.width || layer.width() ),
        layer.normalizeY( obj.height || layer.height() )
    );

    layer.setContext( obj );

    context.closePath();

    return this;
};

Martin.Element.prototype.circle = function() {

    var layer = this.layer,
        context = layer.context,
        obj = this.data,
        centerX = layer.normalizeX( obj.x || 0 ),
        centerY = layer.normalizeY( obj.y || 0 );

    context.beginPath();

    context.arc( centerX, centerY, obj.radius, 0, 2 * Math.PI, false);

    layer.setContext( obj );

    context.closePath();

    return this;

};

Martin.Element.prototype.ellipse = function() {

    var layer = this.layer,
        context = layer.context,
        obj = this.data,
        centerX = layer.normalizeX( obj.x || 0 ),
        centerY = layer.normalizeY( obj.y || 0 ),
        scale;

    if ( obj.radiusX === obj.radiusY ) {
        obj.radius = obj.radiusX;
        return this.circle( canvas, obj );
    }

    context.beginPath();

    if ( obj.radiusX > obj.radiusY ) {

        scale = obj.radiusX / obj.radiusY;

        context.scale( scale, 1 );

        context.arc( centerX / scale, centerY, obj.radiusX / scale, 0, 2 * Math.PI, false);

        context.scale( 1 / scale, 1 );

    } else {

        scale = obj.radiusY / obj.radiusX;

        context.scale( 1, scale );

        context.arc( centerX, centerY / scale, obj.radiusY / scale, 0, 2 * Math.PI, false);

        context.scale( 1, 1 / scale );

    }

    layer.setContext( obj );

    context.closePath();

    return this;
}

Martin.Element.prototype.polygon = function() {

    var layer = this.layer,
        context = layer.context,
        obj = this.data;

    context.beginPath();

    for ( var i = 0; i < obj.points.length; i++ ) {

        var x = obj.points[i][0],
            y = obj.points[i][1],
            toX = layer.normalizeX( x ),
            toY = layer.normalizeY( y );

        if ( i === 0 ) context.moveTo( toX, toY );

        context.lineTo( toX, toY );

    }

    // close the path
    context.lineTo(
        layer.normalizeX(obj.points[0][0]),
        layer.normalizeY(obj.points[0][1])
    );

    layer.setContext( obj );

    context.closePath();

    return this;
};

Martin.Element.prototype.text = function() {

	var layer = this.layer,
        context = layer.context,
        obj = this.data,
		size,
        style,
        font,
        fontOutput;

    var clone = {};

    // use custom getters and setters for these properties
    style = obj.style || '';
    size = obj.size || '';
    font = obj.font || '';

    function fontString(style, size, font) {
        return (style ? style + ' ' : '') + (size || 16) + 'px ' + (font || 'sans-serif');
    };

    fontOutput = fontString(obj.style, obj.size, obj.font);

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
        return context.measureText(obj.text || '').width;
    };

    Object.defineProperty(clone, 'theStyle', {
        get: function() {
            return style;
        },
        set: function(style) {
            fontOutput = fontString(style, obj.size, obj.font);
        }
    });

    Object.defineProperty(clone, 'theSize', {
        get: function() {
            return size;
        },
        set: function(size) {
            fontOutput = fontString(obj.style, size, obj.font);
        }
    });

    Object.defineProperty(clone, 'theFont', {
        get: function() {
            return font;
        },
        set: function(font) {
            fontOutput = fontString(obj.style, obj.size, font);
        }
    });

	context.font = fontOutput;
	context.fillStyle = obj.color || '#000';
	context.textBaseline = 'top';
	context.textAlign = obj.align || 'left';
	context.fillText(
		obj.text || '',
		layer.normalizeX(obj.x || 0),
		layer.normalizeY(obj.y || 0)
	);

	return this;
};

// ----- Removing and moving elements within the stack in the layer

Martin.Element.prototype.layerIndex = function() {
    return this.layer.elements.indexOf(this);
};

Martin.Element.prototype.remove = function() {
    this.layer.elements.splice(this.layerIndex(), 1);
    this.base.render();
    return this;
};

Martin.Element.prototype.bump = function(i) {
    var layerIndex = this.layerIndex();
    this.remove();
    this.layer.elements.splice(layerIndex + i, 0, this);
    this.base.render();
    return this;
};

Martin.Element.prototype.bumpUp = function() {
    return this.bump(1);
};

Martin.Element.prototype.bumpDown = function() {
    return this.bump(-1);
};

Martin.Element.prototype.bumpToTop = function() {
    this.remove();
    this.layer.elements.push(this);
    this.base.render();
    return this;
};

Martin.Element.prototype.bumpToBottom = function() {
    this.remove();
    this.layer.elements.unshift(this);
    this.base.render();
    return this;
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

    this[this.type]();

    this.base.render();

    return this;

};

(function() {
    var elements = ['background', 'line', 'rect', 'circle', 'ellipse', 'polygon', 'text'];

    elements.forEach(function(el) {
        Martin.prototype[el] = function(obj) {
            return new Martin.Element(el, this, obj);
        };
    });
})();

/*

    Martin.Effect constructor

    .desaturate()
    .saturate()
    .lighten()
    .darken()
    .opacity()
    .blur()
      - plus helper functions... and, I should mention:
        StackBlur Algorithm Copyright (c) 2010 Mario Klingemann
        Version: 	0.6
        Author:		Mario Klingemann
        Contact: 	mario@quasimondo.com
        Website:	http://www.quasimondo.com/StackBlurForCanvas
        Twitter:	@quasimondo
*/

Martin.Effect = function(type, canvas, amount) {

    if ( Martin.Effect.prototype.hasOwnProperty(type) ) {

        var layer = canvas.currentLayer;

        this.base = canvas;
        this.type = type;
        this.inverse = false; // some effects are just the inverse of another
        this.layer = layer;

        this.amount = amount;

        layer.addEffect(this);

        this.base.render();

        return this;

    } else {

        throw new Error('Given effect is not an allowed effect.');
    }
};

// Add an effect
(function() {
    var addEffect = function(effect) {
        if (this.effects) {
            this.effects.push(effect);
        } else {
            this.effects = [effect];
        }
        return effect;
    };
    // TODO: effect can be added to element
    // Martin.Element.prototype.addEffect = addEffect;
    Martin.Layer.prototype.addEffect = addEffect;
})();

Martin.Effect.prototype.renderEffect = function() {
    return this[this.type]();
};

// for inverse effects
Martin.Effect.prototype.invert = function(inverse) {
    this.inverse = true;
    return this[inverse]();
};

// Desaturate
Martin.Effect.prototype.desaturate = function() {

    var layer = this.layer,
        amt = this.amount;

    if ( this.inverse ) amt *= -1;

    amt = amt / 100;
    if ( amt > 1 ) amt = 1;

    layer.loop(function(x, y, pixel) {

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

    return this;
};

Martin.Effect.prototype.saturate = function() {
    return this.invert('desaturate');
};

// Lighten and darken. (Darken just returns the opposite of lighten).
// Takes an input from 0 to 100. Higher values return pure white or black.
Martin.Effect.prototype.lighten = function() {

    var layer = this.layer,
        amt = this.amount;

    if ( this.inverse ) amt *= -1;

    amt = amt / 100;
    if ( amt > 1 ) amt = 1;

    layer.loop(function(x, y, pixel) {

        pixel.r += Math.round(amt * 255);
        pixel.g += Math.round(amt * 255);
        pixel.b += Math.round(amt * 255);

        return pixel;
    });

    return this;
};

Martin.Effect.prototype.darken = function() {
    return this.invert('lighten');
};

// Fade uniform
Martin.Effect.prototype.opacity = function() {

    var layer = this.layer,
        amt = this.amount;

    amt = amt / 100;
    if ( amt > 1 ) amt = 1;

    layer.loop(function(x, y, pixel) {
        pixel.a *= amt;
        return pixel;
    });

    return this;
};

// simple stack maker
Martin._BlurStack = function() {
    this.r = this.g = this.b = this.a = 0;
    this.next = null;
};

// helper functions for .blur()
Martin._BlurStack.mul_shift_table = function(i) {
    var mul_table = [1,171,205,293,57,373,79,137,241,27,391,357,41,19,283,265,497,469,443,421,25,191,365,349,335,161,155,149,9,278,269,261,505,245,475,231,449,437,213,415,405,395,193,377,369,361,353,345,169,331,325,319,313,307,301,37,145,285,281,69,271,267,263,259,509,501,493,243,479,118,465,459,113,446,55,435,429,423,209,413,51,403,199,393,97,3,379,375,371,367,363,359,355,351,347,43,85,337,333,165,327,323,5,317,157,311,77,305,303,75,297,294,73,289,287,71,141,279,277,275,68,135,67,133,33,262,260,129,511,507,503,499,495,491,61,121,481,477,237,235,467,232,115,457,227,451,7,445,221,439,218,433,215,427,425,211,419,417,207,411,409,203,202,401,399,396,197,49,389,387,385,383,95,189,47,187,93,185,23,183,91,181,45,179,89,177,11,175,87,173,345,343,341,339,337,21,167,83,331,329,327,163,81,323,321,319,159,79,315,313,39,155,309,307,153,305,303,151,75,299,149,37,295,147,73,291,145,289,287,143,285,71,141,281,35,279,139,69,275,137,273,17,271,135,269,267,133,265,33,263,131,261,130,259,129,257,1];


    var shg_table = [0,9,10,11,9,12,10,11,12,9,13,13,10,9,13,13,14,14,14,14,10,13,14,14,14,13,13,13,9,14,14,14,15,14,15,14,15,15,14,15,15,15,14,15,15,15,15,15,14,15,15,15,15,15,15,12,14,15,15,13,15,15,15,15,16,16,16,15,16,14,16,16,14,16,13,16,16,16,15,16,13,16,15,16,14,9,16,16,16,16,16,16,16,16,16,13,14,16,16,15,16,16,10,16,15,16,14,16,16,14,16,16,14,16,16,14,15,16,16,16,14,15,14,15,13,16,16,15,17,17,17,17,17,17,14,15,17,17,16,16,17,16,15,17,16,17,11,17,16,17,16,17,16,17,17,16,17,17,16,17,17,16,16,17,17,17,16,14,17,17,17,17,15,16,14,16,15,16,13,16,15,16,14,16,15,16,12,16,15,16,17,17,17,17,17,13,16,15,17,17,17,16,15,17,17,17,16,15,17,17,14,16,17,17,16,17,17,16,15,17,16,14,17,16,15,17,16,17,17,16,17,15,16,17,14,17,16,15,17,16,17,13,17,16,17,17,16,17,14,17,16,17,16,17,16,17,9];

    return [ mul_table[i] || mul_table[mul_table.length - 1], shg_table[i] || shg_table[shg_table.length - 1] ];
};

// And, what we've all been waiting for:
Martin.Effect.prototype.blur = function() {

    var layer = this.layer,
        amt = this.amount;

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
        mul_sum = Martin._BlurStack.mul_shift_table(amt)[0],
        shg_sum = Martin._BlurStack.mul_shift_table(amt)[1];

    var it = iterations, // internal iterations in case doing multiple layers
        imageData = layer.getImageData(),
        pixels = imageData.data;

    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
        r_out_sum, g_out_sum, b_out_sum, a_out_sum,
        r_in_sum, g_in_sum, b_in_sum, a_in_sum,
        pr, pg, pb, pa;

    var stackStart = new Martin._BlurStack(),
        stack = stackStart,
        stackEnd,
        stackIn;

    for ( i = 1; i < div; i++ ) {
        stack = stack.next = new Martin._BlurStack();
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

    layer.putImageData( imageData );

    return this;
};

// Adjust the amount of an Effect
Martin.Effect.prototype.increase = function(amt) {

    if ( this.inverse ) amt = -(amt || 1);

    this.amount += amt || 1;
    this.base.render();
    return this;
};

Martin.Effect.prototype.decrease = function(amt) {
    return this.increase(-amt || -1);
};

(function(){
    var effects = ['desaturate', 'saturate', 'lighten', 'darken', 'opacity', 'blur'];

    effects.forEach(function(el) {
        Martin.prototype[el] = function(amt) {
            return new Martin.Effect(el, this, amt);
        };
    });
})();

(function(){
    var events = ['click', 'mouseover', 'mousemove', 'mouseenter', 'mouseleave', 'mouseout', 'mousedown', 'mouseup'];

    events.forEach(function(evt){
        Martin.prototype[evt] = function(cb) {

            function callback(e) {
                cb(e);
                this.render();
            }

            this.canvas.addEventListener(evt, callback.bind(this));
            return this;
        };
    });

    Martin.prototype.on = function(evt, cb) {

        evt = evt.split(' ');

        function callback(e) {
            cb(e);
            this.render();
        }

        evt.forEach(function(ev) {
            if ( events.indexOf(ev) > -1 ) {
                this.canvas.addEventListener(ev, callback.bind(this));
            }
        }, this);

        return this;
    };
})();

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
		if ( typeof val === 'string' && val.slice(-1) === '%' ) val = (+val.slice(0, -1)) * this.canvas[which] / 100;

		// get the ratio, in case we're resizing
		ratio = resize ? val / this.canvas[which] : 1;

		if ( resize ) {

			if ( which === 'width' ) this.scale.x *= ratio;
			if ( which === 'height' ) this.scale.y *= ratio;

			this.canvas[which] = val;
		}

		this.base.render();

		return this;
	};
});
