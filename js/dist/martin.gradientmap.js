Martin.registerEffect('gradientMap', function(data) {

    var min = parseHex(data.start),
        max = parseHex(data.end);

    function parseHex(hex) {

        var output;

        if ( hex.charAt(0) === '#' ) hex = hex.slice(1);

        // coerce to six-digit hex if only 3 given
        if ( hex.length === 3 ) {
            hex = hex.split('');
            hex.splice(2, 0, hex[2]);
            hex.splice(1, 0, hex[1]);
            hex.splice(0, 0, hex[0]);
            hex = hex.join('');
        }

        output = {
            r: parseInt(hex[0] + hex[1], 16),
            g: parseInt(hex[2] + hex[3], 16),
            b: parseInt(hex[4] + hex[5], 16)
        };

        return output;
    }

    this.layer.loop(function(x, y, pixel) {
        pixel.r = Math.round(min.r + (pixel.r / 256) * (max.r - min.r));
        pixel.g = Math.round(min.g + (pixel.g / 256) * (max.g - min.g));
        pixel.b = Math.round(min.b + (pixel.b / 256) * (max.b - min.b));
        return pixel;
    });
});
