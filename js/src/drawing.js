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

    return new Martin.Element('rect', this, obj);

};

// Make a circle -- center X, center Y, radius, color
Martin.prototype.circle = function( obj ) {

    return new Martin.Element('circle', this, obj);

};

// Make an ellipse -- same as circle but with radii for both X and Y
Martin.prototype.ellipse = function( obj ) {

    return new Martin.Element('ellipse', this, obj);

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
