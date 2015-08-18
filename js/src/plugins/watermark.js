Martin.registerElement('watermark', function(data) {


    var padding = 2,
        size = data.size || this.data.size || 12;

    data = {
        text: data.text || '\u00A9', // default to the copyright symbol
        align: data.align || 'right',
        color: data.color || '#fff',
        x: data.x || this.base.width() - padding,
        y: data.y || this.base.height() - size - padding,
        size: size
    };

    this.data = data;

    if ( !this._textElement ) {
        this._textElement = this.layer.text(data);
    } else {
        this._textElement.update(data);
    }
});
