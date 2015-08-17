// Fade uniform
registerEffect('opacity', function(amt) {

    amt = amt / 100;

    var base = this.base;

    this.context.loop(function(x, y, pixel) {
        pixel.a *= amt;
        return pixel;
    });
});
