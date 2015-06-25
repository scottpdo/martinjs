Martin.extend({
    gradientMap: function gradientMap(start, end) {

        var base = this,
            layers = this.layers,
            min = parseHex(start),
            max = parseHex(end);

        if ( !Martin.Effect.prototype.gradientMap ) {

            // set up new effect
            Martin.Effect.prototype.gradientMap = function() {

                var layer = this.layer,
                    min = this.amount.min,
                    max = this.amount.max;

                var i = 0;

                var out = layer.loop(function(x, y, pixel) {
                    // if ( i < 100 ) { console.log(pixel.r); }
                    pixel.r = Math.round(min.r + (pixel.r / 256) * (max.r - min.r));
                    pixel.g = Math.round(min.g + (pixel.g / 256) * (max.g - min.g));
                    pixel.b = Math.round(min.b + (pixel.b / 256) * (max.b - min.b));
                    // if ( i < 100 ) { console.log(pixel.r); }
                    i++;
                    return pixel;
                });

                return this;
            };
        }

        function parseHex(hex) {

            if ( hex.charAt(0) === '#' ) {
                hex = hex.slice(1);
            }

            // coerce to six-digit hex if only 3 given
            if ( hex.length === 3 ) {
                hex = hex.split('');
                hex.splice(2, 0, hex[2]);
                hex.splice(1, 0, hex[1]);
                hex.splice(0, 0, hex[0]);
                hex = hex.join('');
            }

            var regex = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
                result = regex.exec(hex);

            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        // act on the current layer only
        new Martin.Effect('gradientMap', base, { max: max, min: min});

        return this.render();
    }
});
