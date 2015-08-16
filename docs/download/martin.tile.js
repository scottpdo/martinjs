Martin.registerEffect('tile', function(px) {

    var r, g, b, a,
        imageData = this.context.getImageData(),
        pixels = imageData.data;

    px = parseInt(px, 10);

    if ( px > 1 ) {

        this.context.loop(function(x, y, pixel) {

            x -= x % px;
            y -= y % px;

            var target = 4 * (x + canvas.width() * y);

            pixel.r = pixels[target];
            pixel.g = pixels[target + 1];
            pixel.b = pixels[target + 2];
            pixel.a = pixels[target + 3];

            return pixel;
        });
    }
});
