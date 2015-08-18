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
