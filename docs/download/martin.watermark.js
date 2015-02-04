(function(){

    var watermark = function(text, color, size) {

        // default to the copyright symbol
        var text = text || '\u00A9',
            color = color || '#fff',
            size = size || 12,
            padding = 2;
            style = {
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
