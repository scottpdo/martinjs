(function(){

    var watermark = function(text, color, size) {

        // default to the copyright symbol
        text = text || '\u00A9';
        color = color || '#fff';
        size = size || 12;
        var padding = 2;
        var style = {
            align: 'right',
            color: color,
            offsetX: this.canvas.width - padding,
            offsetY: padding,
            size: size
        };

        this.write(text, style);

        return this;
    };

    Martin.extend({ watermark: watermark });

})();
