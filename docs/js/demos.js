$(document).ready(function(){

function sepia(canvas) {

    canvas.darken(10).opacity(0.6).desaturate(100).background('#ea0');

    canvas.newLayer().rect({
        offsetX: 0,
        offsetY: 0,
        width: '100%',
        height: '15%'
    }).opacity(0.5);

    canvas.newLayer().write({
        text: 'The loneliest bunny in the west.',
        offsetX: '50%',
        offsetY: 13,
        align: 'center',
        color: '#fff'
    });

    canvas.convertToImage();
}

if ( document.getElementById('demo-sepia') ) new Martin('demo-sepia', sepia);

function checkerboard(canvas) {

    // .canvas refers to the actual <canvas> element
    var c = canvas.canvas,
        w = c.width,
        h = c.height,
        iter = 0;

    var size = 40,
        x = w / size, // tiles in x direction
        y = h / size; // tiles in y direction

    for ( var i = 0; i < x; i++ ) {

        if ( y % 2 !== 1 ) iter++;

        for ( var j = 0; j < y; j++ ) {

            if ( iter % 2 === 0 ) {

                canvas.rect({
                    offsetX: i * size,
                    offsetY: j * size,
                    height: size,
                    width: size
                });
            }
            iter++;
        }
    }

    canvas.convertToImage();
}

if ( document.getElementById('demo-checkerboard') ) new Martin('demo-checkerboard', checkerboard);

function textShadow(canvas) {

    canvas.background('#aaa');

    var colors = [
        '000', '880', 'ff0'
    ];

    var offsets = [
        { x: 206, y: 74 },
        { x: 203, y: 77 },
        { x: 200, y: 80 }
    ];

    for ( var i = 0; i < 3; i++ ) {
        canvas.write({
            text: 'Hello World!',
            offsetX: offsets[i].x,
            offsetY: offsets[i].y,
            align: 'center',
            color: '#' + colors[i],
            size: 40
        });
    }

    canvas.convertToImage();
}

if ( document.getElementById('demo-text-shadow') ) new Martin('demo-text-shadow', textShadow);

});
