registerElement('circle', function(data) {

    var layer = this.layer,
        context = this.context,
        centerX = layer.normalizeX( data.x || 0 ),
        centerY = layer.normalizeY( data.y || 0 );

    context.arc( centerX, centerY, data.radius, 0, 2 * Math.PI, false);

});
