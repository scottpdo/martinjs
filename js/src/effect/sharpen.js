Martin.registerEffect('sharpen', function(amt) {

    if ( isNaN(amt) ) return this;

    var w = this.base.width(),
        h = this.base.height();

    var buffer = document.createElement('canvas');
    buffer.width = this.base.width();
    buffer.height = this.base.height();

    var dstData = buffer.getContext('2d').createImageData(w, h),
        dstBuff = dstData.data;
    
    var weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
        katet = Math.round(Math.sqrt(weights.length)),
        half = (katet * 0.5) | 0,
        srcBuff = this.context.getImageData(0, 0, w, h).data,
        y = h;

    amt /= 100;

    while (y--) {

        x = w;

        while (x--) {

            var sy = y,
                sx = x,
                dstOff = (y * w + x) * 4,
                r = 0,
                g = 0,
                b = 0,
                a = 0;

            for (var cy = 0; cy < katet; cy++) {
                for (var cx = 0; cx < katet; cx++) {

                    var scy = sy + cy - half;
                    var scx = sx + cx - half;

                    if (scy >= 0 && scy < h && scx >= 0 && scx < w) {

                        var srcOff = (scy * w + scx) * 4;
                        var wt = weights[cy * katet + cx];

                        r += srcBuff[srcOff] * wt;
                        g += srcBuff[srcOff + 1] * wt;
                        b += srcBuff[srcOff + 2] * wt;
                        a += srcBuff[srcOff + 3] * wt;
                    }
                }
            }

            dstBuff[dstOff]     = r * amt + srcBuff[dstOff] * (1 - amt);
            dstBuff[dstOff + 1] = g * amt + srcBuff[dstOff + 1] * (1 - amt);
            dstBuff[dstOff + 2] = b * amt + srcBuff[dstOff + 2] * (1 - amt)
            dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
        }
    }

    this.context.putImageData(dstData);
});