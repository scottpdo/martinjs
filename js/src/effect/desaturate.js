// Desaturate
function desaturate(amt) {

    this.context.loop(function(x, y, pixel) {

        var r = pixel.r,
            g = pixel.g,
            b = pixel.b;

        var grayscale = r * 0.3 + g * 0.59 + b * 0.11;
            r = (1 - amt) * r + amt * grayscale;        // red
            g = (1 - amt) * g + amt * grayscale;        // green
            b = (1 - amt) * b + amt * grayscale;        // blue

        pixel.r = r;
        pixel.g = g;
        pixel.b = b;

        return pixel;

    });
}

registerEffect('desaturate', function(amt) {
    amt = amt / 100;
    desaturate.call(this, amt);
});

// inverse of saturate
registerEffect('saturate', function(amt) {
    amt = -amt / 100;
    desaturate.call(this, amt);
});
