# Demos

### Sepia photo with caption

<img id="demo-sepia" height="300" width="400" src="images/bunny.jpg">

```js
// darken and desaturate the base image
canvas.darken(10);
canvas.desaturate(100);

// create a new layer, give it a brownish background,
// and reduce the opacity to 40%
canvas.newLayer();
canvas.background('#ea0');
canvas.opacity(40);

// Draw a black rectangle that will be the background
// for the text. This inherits the layer's 40% opacity!
canvas.rect({
    width: '100%',
    height: '15%'
});

// Create a new layer, and write the text on it.
canvas.newLayer();
canvas.text({
    text: 'The loneliest bunny in the west.',
    x: '50%',
    y: 13,
    align: 'center',
    color: '#fff'
});

canvas.convertToImage();
```

### Checkerboard pattern

<canvas id="demo-checkerboard" height="200" width="400"></canvas>

```js
// .canvas refers to the actual <canvas> element
var canvas = Martin('demo-checkerboard');
var w = canvas.width(),
    h = canvas.height(),
    iter = 0;

var size = 40,
    x = w / size, // tiles in x direction
    y = h / size; // tiles in y direction

for ( var i = 0; i < x; i++ ) {

    if ( y % 2 !== 1 ) iter++;

    for ( var j = 0; j < y; j++ ) {

        if ( iter % 2 === 0 ) {

            canvas.rect({
                x: i * size,
                y: j * size,
                height: size,
                width: size
            });
        }
        iter++;
    }
}
```
