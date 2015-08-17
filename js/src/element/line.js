registerElement('line', function(data) {

    var layer = this.layer,
        context = this.context;

    context.moveTo(
        layer.normalizeX( data.x || 0 ),
        layer.normalizeY( data.y || 0 )
    );

    context.lineTo(
        layer.normalizeX( data.endX ),
        layer.normalizeY( data.endY )
    );

    if ( !data.strokeWidth ) data.strokeWidth = 1;
    data.stroke = data.color ? data.color : '#000';

    return this;
});
