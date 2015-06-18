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
    // render the element
    this[this.type]();
    // apply any effects
    if ( this.effects ) {
        this.effects.forEach(function(effect) {
            // TODO
        });
    }
    return this;
};

Martin.Element.prototype.image = function() {

    var layer = this.layer,
        context = layer.context,
        obj = this.data;

    context.drawImage(
        obj.original,
        0, 0, obj.original.naturalWidth, obj.original.naturalHeight,
        0, 0, layer.width(), layer.height()
    );

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
        layer.normalizeX( obj.height || layer.width() ),
        layer.normalizeY( obj.width || layer.height() )
    );

    if ( !obj.strokeWidth ) obj.strokeWidth = 1;
    obj.stroke = obj.color ? obj.color : '#000';

    Martin.setContext( context, obj );

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

    Martin.setContext( context, obj );

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

    Martin.setContext( context, obj );

    context.closePath();

    return this;

};

Martin.Element.prototype.ellipse = function() {

    if ( obj.radiusX === obj.radiusY ) {
        obj.radius = obj.radiusX;
        return this.circle( canvas, obj );
    }

    var layer = this.layer,
        context = layer.context,
        centerX = layer.normalizeX( obj.offsetX || 0 ),
        centerY = layer.normalizeY( obj.offsetY || 0 ),
        scale;

    context.beginPath();

    if ( obj.radiusX > obj.radiusY ) {

        scale = obj.radiusX / obj.radiusY;

        context.scale( this.scale.x * scale, this.scale.y );

        context.arc( centerX / scale, centerY, obj.radiusX / scale, 0, 2 * Math.PI, false);

        context.scale( this.scale.x / scale, this.scale.y );

    } else {

        scale = obj.radiusY / obj.radiusX;

        context.scale( this.scale.x, this.scale.y * scale );

        context.arc( centerX, centerY / scale, obj.radiusY / scale, 0, 2 * Math.PI, false);

        context.scale( this.scale.x, this.scale.y / scale );

    }

    Martin.setContext( context, obj );

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

    Martin.setContext( context, obj );

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
