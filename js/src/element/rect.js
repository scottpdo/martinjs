function rect(data) {

    var layer = this.layer,
        context = this.context;

    context.rect(
        layer.normalizeX( data.x || 0 ),
        layer.normalizeY( data.y || 0 ),
        layer.normalizeX( data.width || layer.width() ),
        layer.normalizeY( data.height || layer.height() )
    );
}

registerElement('rect', function(data) {
    rect.call(this, data);
});

registerElement('background', function(data) {
    rect.call(this, data);
});
