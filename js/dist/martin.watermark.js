(function() {

    var watermark = function(text, color, size) {

        // default to the copyright symbol
        text = text || '\u00A9';
        color = color || '#fff';
        size = size || 12;
        var padding = 2;
        var data = {
            text: text,
            align: 'right',
            color: color,
            x: this.width() - padding,
            y: this.height() - size - padding,
            size: size
        };

        return this.text(data);

    };

    Martin.extend({ watermark: watermark });

})();
