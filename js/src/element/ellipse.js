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
