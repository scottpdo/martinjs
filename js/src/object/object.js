// shared methods for objects: layers, elements, effects

Martin.Object = function() {};
var ObjMethods,
    ObjMethod;

ObjMethods = {

    loop: function(cb, put) {

        var width = this.base.width(),
            height = this.base.height();

        var imageData, pixels, len,
            n, x, y,
            r, g, b, a,
            pixel,
            output;

        imageData = this.getImageData();

        if ( imageData ) {

            pixels = imageData.data;
            len = pixels.length;

            for ( var i = 0; i < len; i += 4 ) {

                // xy coordinates
                n = i / 4;
                x = n % width;
                y = Math.floor(n / height);

                // rgba values
                r = pixels[i];
                g = pixels[i + 1];
                b = pixels[i + 2];
                a = pixels[i + 3];

                // pass an object corresponding to the pixel to the callback
                pixel = { r: r, g: g, b: b, a: a };

                // execute the callback within the context of this layer's, uh... context
                output = cb.call( this.context, x, y, pixel );

                // reassign the actual rgba values of the pixel based on the output from the loop
                pixels[i] = output.r;
                pixels[i + 1] = output.g;
                pixels[i + 2] = output.b;
                pixels[i + 3] = output.a;

            }

            // explicitly declare if image data from callback is not to be used
            if ( put !== false ) this.putImageData( imageData );

        }

        return this;
    },

    getImageData: function() {
        var imageData = this.context && this.canvas.width > 0 && this.canvas.height > 0 ?
            this.context.getImageData(0, 0, this.canvas.width, this.canvas.height) :
            null;
        return imageData;
    },

    // Simple shell for putting image data
    putImageData: function(imageData) {
        this.context.putImageData( imageData, 0, 0 );
        return this;
    },

    clear: function clear() {
        this.context.clearRect(0, 0, this.base.width(), this.base.height());
        return this;
    },

    stackIndex: function() {
        return this.stack.indexOf(this);
    },

    remove: function() {
        this.stack.splice(this.stackIndex(), 1);
        this.base.autorender();
        return this;
    },

    bump: function(i) {
        var index = this.stackIndex();
        this.remove();
        this.stack.splice(index + i, 0, this);
        this.base.autorender();
        return this;
    },

    bumpUp: function() {
        return this.bump(1);
    },

    bumpDown: function() {
        return this.bump(-1);
    },

    bumpToTop: function() {
        this.remove();
        this.stack.push(this);
        this.base.autorender();
        return this;
    },

    bumpToBottom: function() {
        this.remove();
        this.stack.unshift(this);
        this.base.autorender();
        return this;
    },
};

for ( ObjMethod in ObjMethods ) {
    Martin.Object.prototype[ObjMethod] = ObjMethods[ObjMethod];
}
