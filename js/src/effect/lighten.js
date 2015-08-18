// Lighten and darken. (Darken just returns the opposite of lighten).
// Takes an input from 0 to 100. Higher values return pure white or black.
function lighten(amt) {

    this.context.loop(function(x, y, pixel) {

        pixel.r += Math.round(amt * 255);
        pixel.g += Math.round(amt * 255);
        pixel.b += Math.round(amt * 255);

        return pixel;
    });
}

registerEffect('lighten', function(amt) {
    amt = amt / 100;
    lighten.call(this, amt);
});

registerEffect('darken', function(amt) {
    amt = -amt / 100;
    lighten.call(this, amt);
});
