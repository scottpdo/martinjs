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
            if ( this.canvas.width > 0 && this.canvas.height > 0 ) {
                layer.context.drawImage(this.canvas, 0, 0);
            }
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
