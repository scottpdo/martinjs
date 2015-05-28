/*

    Martin.Element constructor

    Elements:
    .line()
    .rect()
    .circle()
    .ellipse()
    .polygon()

    Element methods:
    .moveTo()

    Finally:
    - Loop through drawing methods and
      create a corresponding method on the main Martin instance
*/


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

Martin.Element.prototype.line = function(canvas, obj) {

    this.context.beginPath();

    this.context.moveTo(
        canvas.normalizeX(obj.startX || 0 ),
        canvas.normalizeY(obj.startY || 0 )
    );

    this.context.lineTo(
        canvas.normalizeX(obj.endX || canvas.width() ),
        canvas.normalizeY(obj.endY || canvas.height() )
    );

    if ( !obj.strokeWidth ) obj.strokeWidth = 1;
    obj.stroke = obj.color ? obj.color : '#000';

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

Martin.Element.prototype.circle = function(canvas, obj) {

    var centerX = canvas.normalizeX( obj.offsetX || 0 ),
        centerY = canvas.normalizeY( obj.offsetY || 0 );

    this.context.beginPath();

    this.context.arc( centerX, centerY, obj.radius, 0, 2 * Math.PI, false);

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

        this.context.scale( 1 / scale, 1 );

    } else {

        scale = obj.radiusY / obj.radiusX;

        this.context.scale( 1, scale );

        this.context.arc( centerX, centerY / scale, obj.radiusY / scale, 0, 2 * Math.PI, false);

        this.context.scale( 1, 1 / scale );

    }

    Martin.setContext( this.context, obj );

    this.context.closePath();

    return this;
}

Martin.Element.prototype.polygon = function(canvas, obj) {

    this.context.beginPath();

    for ( var i = 0; i < obj.points.length; i++ ) {

        var x = obj.points[i][0],
            y = obj.points[i][1],
            toX = canvas.normalizeX( x ),
            toY = canvas.normalizeY( y );

        if ( i === 0 ) this.context.moveTo( toX, toY );

        this.context.lineTo( toX, toY );

    }

    // close the path
    this.context.lineTo(
        canvas.normalizeX(obj.points[0][0]),
        canvas.normalizeY(obj.points[0][1])
    );

    Martin.setContext( this.context, obj );

    this.context.closePath();

    return this;
}

// ----- Move an element to new coordinates
Martin.Element.prototype.moveTo = function(x, y) {

    var data = this.data;

    // clear existing data
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if ( this.type === 'line' ) {
        data.endX += x - data.startX;
        data.endY += y - data.startY;
        data.startX = x;
        data.startY = y;
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
    } else {
        data.offsetX = x;
        data.offsetY = y;
    }

    this[this.type](this.base, data);

    return this;

};

(function(){
    var drawingElements = ['line', 'rect', 'circle', 'ellipse', 'polygon'];

    drawingElements.forEach(function(el) {
        Martin.prototype[el] = function(obj) {
            return new Martin.Element(el, this, obj);
        }
    });
})();
