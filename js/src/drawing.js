/*
    .line()
    .rect()
    .circle()
    .ellipse()
    .polygon()
*/

// Lines
Martin.prototype.line = function( obj ) {

    this.context.beginPath();

    this.context.moveTo( this.normalizeX(obj.startX), this.normalizeY(obj.startY) );

    this.context.lineTo( this.normalizeX(obj.endX), this.normalizeY(obj.endY) );

    if ( !obj.strokeWidth ) obj.strokeWidth = 1;
    obj.stroke = obj.color ? obj.color : '#000';

    this.setContext( obj );

    return this;

};

// Create a rectangle
Martin.prototype.rect = function( obj ) {

    if ( !obj.offsetX ) obj.offsetX = 0;
    if ( !obj.offsetY ) obj.offsetY = 0;

    this.context.beginPath();

    this.context.rect(
        this.normalizeX( obj.offsetX ),
        this.normalizeY( obj.offsetY ),
        this.normalizeX( obj.width ),
        -this.canvas.height + this.normalizeY( obj.height ) // we don't *really* want to normalize the height here, just percentage-wise
    );

    this.setContext( obj );

    this.context.closePath();

    return this;
};

// Make a circle -- center X, center Y, radius, color
Martin.prototype.circle = function( obj ) {

    if ( !obj.offsetX ) obj.offsetX = this.width() / 2;
    if ( !obj.offsetY ) obj.offsetY = this.height() / 2;

    var centerX = this.normalizeX( obj.offsetX ),
        centerY = this.normalizeY( obj.offsetY );

    this.context.beginPath();

    this.context.arc( centerX, centerY, obj.radius, 0, 2 * Math.PI, false);

    this.setContext( obj );

    return this;

};

// Make an ellipse -- same as circle but with radii for both X and Y
Martin.prototype.ellipse = function( obj ) {

    if ( !obj.offsetX ) obj.offsetX = this.width() / 2;
    if ( !obj.offsetY ) obj.offsetY = this.height() / 2;

    if ( obj.radiusX === obj.radiusY ) {
        obj.radius = obj.radiusX;
        return this.circle( obj );
    }

    var centerX = this.normalizeX( obj.offsetX ),
        centerY = this.normalizeY( obj.offsetY );

    this.context.beginPath();

    var scale;

    if ( obj.radiusX > obj.radiusY ) {

        scale = obj.radiusX / obj.radiusY;

        this.context.scale( scale, 1 );

        this.context.arc( centerX / scale, centerY, obj.radiusX / scale, 0, 2 * Math.PI, false);

    } else {

        scale = obj.radiusY / obj.radiusX;

        this.context.scale( 1, scale );

        this.context.arc( centerX, centerY / scale, obj.radiusY / scale, 0, 2 * Math.PI, false);

    }

    this.setContext( obj );

    this.context.restore();

    return this;

};

// Given an array of points i.e. [ [0, 10], [5, 20], [0, 15] ], draw a polygon.
// Points are parsed as pixels if integers or percentage if of the form '10%'
Martin.prototype.polygon = function( arr, obj ) {

    if ( typeof obj === 'string' ) obj = { color: obj };

    this.context.beginPath();

    for (var i = 0; i < arr.length; i++) {

        var toX = this.normalizeX( arr[i][0] ),
            toY = this.normalizeY( arr[i][1] );

        if ( i === 0 ) this.context.moveTo( toX, toY );

        this.context.lineTo( toX, toY );

    }

    // close the path
    this.context.lineTo( this.normalizeX(arr[0][0]), this.normalizeY(arr[0][1]) );

    this.setContext( obj );

    this.context.closePath();

    return this;

};
