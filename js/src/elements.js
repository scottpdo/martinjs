Martin.Element = function(type, canvas, obj) {

    if ( Martin.Element.prototype.hasOwnProperty(type) ) {

        // adds a new canvas within the current layer
        var layer = canvas.currentLayer;
        var index = layer.addElement(type);

        // base refers to the instance of Martin
        this.base = canvas;
        this.layer = layer;
        this.canvas = this.layer.canvas;
        this.context = this.layer.context;

        this.data = obj;
        this.type = type;
        this.index = index;

        // draw the element
        this[type].call(layer, canvas, obj);

        return this;

    } else {

        throw new Error('Given type is not an allowed element. Check Martin.elements for allowed types.');
    }
};

Martin.Element.prototype.circle = function(canvas, obj) {

    var centerX = canvas.normalizeX( obj.offsetX || 0 ),
        centerY = canvas.normalizeY( obj.offsetY || 0 );

    this.context.beginPath();

    this.context.arc( centerX, centerY, obj.radius, 0, 2 * Math.PI, false);

    Martin.setContext( this.context, obj );

    this.context.closePath();

    return this;

};

Martin.Element.prototype.rect = function(canvas, obj) {

    this.context.beginPath();

    this.context.rect(
        canvas.normalizeX( obj.offsetX || 0 ),
        canvas.normalizeY( obj.offsetY || 0 ),
        canvas.normalizeX( obj.width ),
        canvas.normalizeY( obj.height )
    );

    Martin.setContext( this.context, obj );

    this.context.closePath();

    return this;
};

Martin.Element.prototype.ellipse = function(canvas, obj) {

    if ( obj.radiusX === obj.radiusY ) {
        obj.radius = obj.radiusX;
        return this.circle( canvas, obj );
    }

    var centerX = canvas.normalizeX( obj.offsetX || 0 ),
        centerY = canvas.normalizeY( obj.offsetY || 0 ),
        scale;

    this.context.beginPath();

    if ( obj.radiusX > obj.radiusY ) {

        scale = obj.radiusX / obj.radiusY;

        this.context.scale( scale, 1 );

        this.context.arc( centerX / scale, centerY, obj.radiusX / scale, 0, 2 * Math.PI, false);

    } else {

        scale = obj.radiusY / obj.radiusX;

        this.context.scale( 1, scale );

        this.context.arc( centerX, centerY / scale, obj.radiusY / scale, 0, 2 * Math.PI, false);

    }

    Martin.setContext( this.context, obj );

    this.context.closePath();

    return this;
}

// ----- Move an element to new coordinates
Martin.Element.prototype.moveTo = function(x, y) {

    // clear existin data
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.data.offsetX = x;
    this.data.offsetY = y;

    this[this.type](this.base, this.data);

    return this;

};
