<img id="img" style="opacity: 0;" src="images/marty-banner.png">

<script>
var canvas = Martin('img'),
    effect = canvas.blur(100);

canvas.darken(10);

canvas.newLayer();

var circle = canvas.circle({
    x: '50%',
    y: '50%',
    radius: 120,
    color: '#fff'
});
var circleOpacity = canvas.opacity(0);
canvas.blur(90);

canvas.mousemove(function(e) {
    circle.moveTo(e.offsetX, e.offsetY);
});

(function fadeIn() {
    if ( effect.amount > 0 ) {
        effect.decrease();
    }
    if ( circleOpacity.amount < 100 ) {
        circleOpacity.increase();
    }
    requestAnimationFrame(fadeIn);
})();

canvas.newLayer();

var text = canvas.text({
    font: 'Futura',
    text: 'THIS IS MARTIN.JS',
    align: 'center',
    x: '50%',
    y: 20,
    color: '#fff',
    size: 66
});
</script>

Martin.js is a JavaScript library for working with HTML5 canvas. Martin supports jQuery-like chained methods, and makes photo manipulation, drawing, and animation in browser easy for developers and users.

You can download Martin (v0.2.4) here:

- [Full version, annotated (33 kb)](download/martin.js)
- [Minified (15 kb)](download/martin.min.js)

Or through Bower:

```js
bower install martinjs --save
```

\- Scottland / [@scottpdonaldson](https://twitter.com/scottpdonaldson)

<hr>

## Initializing

First, make sure you've included the source file, ideally in the `<head>` of the page, but always before you call `Martin`.

```html
<script src="path/to/martin.min.js"></script>
```

Set up a canvas like this:
```js
var canvas = Martin('el');
```

`el` can be the ID of an existing `<canvas>` or `<img>` element, an element itself, or nothing (in which case you will work on a virtual/buffer canvas).

<hr>

## Example

```html
<img id="image" src="bunny.jpg">
```

<img id="home-example" src="images/bunny.jpg">

We're going to take the original image, draw a white rectangle on it, write "Hello!" over the rectangle, and then desaturate it all by 100% -- turning it black and white.

```js
var canvas = Martin('image');

canvas.rect({
    x: 100,
    y: 200,
    width: 90,
    height: 50,
    color: '#fff'
});

canvas.text({
    text: 'Hello!',
    align: 'center',
    size: 18,
    x: 145,
    y: 215
});

canvas.desaturate(100);
```

<script>
var canvas = Martin('home-example');

canvas.rect({
    x: 100,
    y: 200,
    width: 90,
    height: 50,
    color: '#fff'
});

canvas.text({
    text: 'Hello!',
    align: 'center',
    size: 18,
    x: 145,
    y: 215
});

canvas.desaturate(100);
</script>
