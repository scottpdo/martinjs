$(document).ready(function(){

Martin('martin-height-200-crop').height(200);
Martin('martin-height-200-resize').height(200, true);
Martin('martin-height-400-resize').height(400, true);
Martin('martin-width-200-crop').width(200);
Martin('martin-width-200-resize').width(200, true);
Martin('martin-width-500-resize').width(500, true);

(function(){
    var back = Martin('martin-background');
    back.newLayer();
    back.background('#f00');
    back.opacity(50);
})();

line = Martin('martin-line').line({
    x: 40,
    y: 100,
    endX: '95%',
    endY: 30,
    strokeWidth: 10,
    color: '#fff',
    cap: 'round'
});

Martin('martin-rect').rect({
    x: '60%',
    y: 20,
    width: '40%',
    height: 260,
    color: '#ff0'
});

var poly = Martin('martin-polygon');
poly.polygon({
    points: [
        ['20%', '10%'],
        ['40%', '40%'],
        ['20%', '40%']
    ],
    color: '#fff' // white
});

poly.polygon({
    points: [
        [300, 200],
        [350, 200],
        [300, 250],
        [250, 250]
    ],
    color: '#00f', // blue fill
    strokeWidth: 2,
    stroke: '#000' // black stroke
});

Martin('martin-circle').circle({
    x: 320,
    y: 250,
    radius: 35,
    color: '#ef3'
});

Martin('martin-ellipse').ellipse({
    x: 300,
    y: 250,
    radiusX: 100,
    radiusY: 35,
    color: '#ef3'
});

Martin('martin-text').text({
    text: 'Hello, world!',
    x: 140,
    y: 220,
    size: 20,
    color: '#fe0',
    font: 'Georgia'
});

(function() {
    var canvas = Martin('martin-bump-up');
    var circle1 = canvas.circle({
        radius: 100,
        color: '#f00'
    });
    var circle2 = canvas.circle({
        x: 100,
        radius: 100,
        color: '#00f'
    });
    // circle 1 is now below circle 2
    circle1.bumpUp();
})();

(function() {
    var canvas = Martin('martin-move-to');
    var circle1 = canvas.circle({
        radius: 100,
        x: '50%',
        y: '50%',
        color: '#f00'
    });
    var circle2 = canvas.circle({
        radius: 60,
        x: '50%',
        y: '50%',
        color: '#fff'
    });
    var t = 0;
    (function bounce() {
        t += Math.PI / 180;
        circle1.moveTo( 0.5 * canvas.width(), 0.5 * canvas.height() + 30 * Math.sin(t) );
        circle2.moveTo( 0.5 * canvas.width(), 0.5 * canvas.height() + 30 * Math.sin(t) );
        requestAnimationFrame(bounce);
    })();
})();

Martin('martin-saturate').saturate(100);
Martin('martin-desaturate').desaturate(80);
Martin('martin-lighten').lighten(25);
Martin('martin-darken').darken(25);
Martin('martin-opacity').opacity(50);
Martin('martin-blur').blur(15);

(function() {
    var canvas = Martin('martin-flash');
    var effect = canvas.lighten(0);
    var increasing = true;
    (function flash() {
        var amount = effect.amount;
        if ( increasing && amount < 100 ) {
            effect.increase();
        } else if ( increasing && amount === 100 ) {
            increasing = false;
            effect.decrease()

        // .lighten() and .darken() are the inverses of each other,
        // and so actually range between -100 and 100
        } else if ( !increasing && amount > -100 ) {
            effect.decrease();
        } else {
            increasing = true;
            effect.increase();
        }
        requestAnimationFrame(flash);
    })();
})();

(function() {
    var canvas = Martin('martin-click');
    var blurred = false,
        effect = canvas.blur(0); // don't actually blur, but add an effect

    canvas.click(function() {
        if ( !blurred ) {
            effect.increase(20);
            blurred = true;
        } else {
            effect.decrease(20);
            blurred = false;
        }
    });
})();

(function() {
    var canvas = Martin('martin-mouseover');
    var circle = canvas.circle({
        x: Math.random() * canvas.width(),
        y: Math.random() * canvas.height(),
        radius: 50,
        color: '#00f'
    });

    canvas.on('mouseover mouseout', function() {
        // move the circle to random coordinates on the canvas
        circle.moveTo( Math.random() * canvas.width(), Math.random() * canvas.height() );
    });
})();

(function() {
    var canvas = Martin('martin-mousedown');
    function randomCircle() {

        // generate a random color and size
        var hex = '0123456789abcdef';
        var radius = Math.random() * 50,
            r = hex[Math.floor(Math.random() * hex.length)],
            g = hex[Math.floor(Math.random() * hex.length)],
            b = hex[Math.floor(Math.random() * hex.length)];

        canvas.circle({
            radius: radius,
            color: '#' + r + g + b,
            x: Math.random() * canvas.width(),
            y: Math.random() * canvas.height()
        });
    }
    // fire once for good measure :-)
    randomCircle();
    canvas.on('mousedown mouseup', randomCircle);
})();

(function() {
    var canvas = Martin('martin-mousemove');
    var text = canvas.text({
        text: 'Follow that mouse!',
        x: '50%',
        y: '50%',
        color: '#fff',
        size: 24,
        align: 'center'
    });

    canvas.mousemove(function(e) {
        text.moveTo(e.offsetX, e.offsetY);
    });
})();

Martin('martin-watermark').watermark('Photo credit: Scottland Donaldson');

});
