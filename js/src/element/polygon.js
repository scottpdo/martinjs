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
