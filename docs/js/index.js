$(document).ready(function(){

function init(canvas) {

    canvas.rect({
        offsetX: 130,
        offsetY: 20,
        width: 90,
        height: 50,
        color: '#fff'
    });

    canvas.write({
        text: 'Hello!',
        size: 18,
        offsetX: 145,
        offsetY: 35
    });

    canvas.desaturate(100).convertToImage();

}

if ( document.getElementById('image') ) new Martin('image', init);

function overview(canvas) {

    canvas.rect({
        offsetX: 150,
        offsetY: 25,
        width: 200,
        height: 250,
        color: '#33e' // blue
    });

}

if ( document.getElementById('martin-overview') ) new Martin('martin-overview', overview);

function cropHeight200(canvas) {
    canvas.height(200);
}

function resizeHeight200(canvas) {
    canvas.height(200, true);
}

function resizeHeight400(canvas) {
    canvas.height(400, true);
}

if ( document.getElementById('martin-height-200-crop') ) new Martin('martin-height-200-crop', cropHeight200);
if ( document.getElementById('martin-height-200-resize') ) new Martin('martin-height-200-resize', resizeHeight200);
if ( document.getElementById('martin-height-400-resize') ) new Martin('martin-height-400-resize', resizeHeight400);

function cropWidth200(canvas) {
    canvas.width(200);
}

function resizeWidth200(canvas) {
    canvas.width(200, true);
}

function resizeWidth500(canvas) {
    canvas.width(500, true);
}

if ( document.getElementById('martin-width-200-crop') ) new Martin('martin-width-200-crop', cropWidth200);
if ( document.getElementById('martin-width-200-resize') ) new Martin('martin-width-200-resize', resizeWidth200);
if ( document.getElementById('martin-width-500-resize') ) new Martin('martin-width-500-resize', resizeWidth500);

function saturate(canvas) {
    canvas.saturate(100);
}

if ( document.getElementById('martin-saturate') ) new Martin('martin-saturate', saturate);

function desaturate(canvas) {
    canvas.desaturate(80);
}

if ( document.getElementById('martin-desaturate') ) new Martin('martin-desaturate', desaturate);


function lighten(canvas) {
    canvas.lighten(25);
}

if ( document.getElementById('martin-lighten') ) new Martin('martin-lighten', lighten);

function darken(canvas) {
    canvas.darken(25);
}

if ( document.getElementById('martin-darken') ) new Martin('martin-darken', darken);

function opacity(canvas) {
    canvas.opacity(0.5);
}

if ( document.getElementById('martin-opacity') ) new Martin('martin-opacity', opacity);

function blur(canvas) {
    canvas.blur(15);
}

if ( document.getElementById('martin-blur') ) new Martin('martin-blur', blur);

function background(canvas) {
    canvas.opacity(0.5).background('#f00');
}

if ( document.getElementById('martin-background') ) new Martin('martin-background', background);

function line(canvas) {
    canvas.line({
        startX: 40,
        startY: 100,
        endX: '100%',
        endY: 0,
        strokeWidth: 10,
        color: '#fff',
        cap: 'round'
    });
}

if ( document.getElementById('martin-line') ) new Martin('martin-line', line);

function rect(canvas) {
    canvas.rect({
        offsetX: '60%',
        offsetY: 20,
        width: '40%',
        height: 260,
        color: '#ff0'
    });
}

if ( document.getElementById('martin-rect') ) new Martin('martin-rect', rect);

function polygon(canvas) {
    canvas.polygon([ ['20%', '10%'], ['40%', '40%'], ['20%', '40%'] ], '#fff');
    canvas.polygon(
        [
            [300, 200],
            [350, 200],
            [300, 250],
            [250, 250]
        ], {
            color: '#00f',
            strokeWidth: 4,
            stroke: '#000'
        });
}

if ( document.getElementById('martin-polygon') ) new Martin('martin-polygon', polygon);

function circle(canvas) {
    canvas.circle({
        offsetX: 300,
        offsetY: 250,
        radius: 35,
        color: '#ef3'
    });
}

if ( document.getElementById('martin-circle') ) new Martin('martin-circle', circle);

function ellipse(canvas) {
    canvas.ellipse({
        offsetX: 300,
        offsetY: 250,
        radiusX: 100,
        radiusY: 35,
        color: '#ef3'
    });
}

if ( document.getElementById('martin-ellipse') ) new Martin('martin-ellipse', ellipse);

function write(canvas) {
    canvas.write('Hello World!', { color: '#fff' });
    canvas.write({
        text: 'The sky is blue.',
        offsetX: 220,
        offsetY: 220,
        size: 20,
        color: '#fff'
    });
}

if ( document.getElementById('martin-write') ) new Martin('martin-write', write);

function watermark(canvas) {
    canvas.watermark('Photo credit: Scottland Donaldson');
}

if ( document.getElementById('martin-watermark')) new Martin('martin-watermark', watermark);

});
