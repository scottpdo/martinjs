# Elements

**From the working canvas**, an element will be returned from the following methods. Elements are added to the top of the current layer.

### .background(`color`)

Fills the background of the current layer with `color` .

```js
// create a new layer, give it a red background, set opacity to 50%
canvas.newLayer();
canvas.background('#f00');
canvas.opacity(50);
```

<img id="martin-background" src="images/bunny.jpg">

### .line(`obj`)

`obj` must have key-value pairs for:

* `x`
* `y`
* `width`
* `height`

For all of the above, value must be a number (will be read as pixels from upper left 0) or a percent as a string (ex. '50%').

Optional:

* `strokeWidth` (defaults to 1)
* `color` (defaults to black)
* `cap` (defaults to square)

```js
canvas.line({
    x: 40,
    y: 100,
    endX: '95%',
    endY: 30,
    strokeWidth: 10,
    color: '#fff',
    cap: 'round'
});
```

<img id="martin-line" src="images/bunny.jpg">

### .rect(obj)

`obj` must have key-value pairs for:

* `x`
* `y`
* `width`
* `height`

For all of the above, value must be a number (will be read as pixels from upper left 0) or a percent as a string (ex. '50%').

Optional:

* `color` (defaults to black)
* `strokeWidth` (defaults to 0)
* `stroke` (defaults to transparent)

```js
canvas.rect({
    x: '60%',
    y: 20,
    width: '40%',
    height: 260,
    color: '#ff0'
});
```

<img id="martin-rect" src="images/bunny.jpg" height="300" width="400">

### .polygon(`obj`)

`obj` must have a key `points`, which must be an array of arrays, where each nested array represents a point of the polygon. Points may be numbers, percentages, or mixed (ex. `arr = [[20, 40], ['10%', '50%'], [80, '75%']]` ).

`obj` accepts the same optional key-value pairs as `.rect()` , with the same defaults.

```js
canvas.polygon({
    points: [
        ['20%', '10%'],
        ['40%', '40%'],
        ['20%', '40%']
    ],
    color: '#fff' // white
});

canvas.polygon({
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
```

<img id="martin-polygon" src="images/bunny.jpg" height="300" width="400">

### .circle(`obj`)

Requires `x`, `y`, `radius` (`radius` may only be a number, *not* a percent as string).

Same options and defaults as `.rect()` .

```
canvas.circle({
    x: 320,
    y: 250,
    radius: 35,
    color: '#ef3'
});
```

<img id="martin-circle" src="images/bunny.jpg" height="300" width="400">

### .ellipse(`obj`)

Requires `x`, `y`, `radiusX`, `radiusY` (the two radii may only be numbers).

Same options and defaults as `.rect()` .

```
canvas.ellipse({
    offsetX: 300,
    offsetY: 250,
    radiusX: 100,
    radiusY: 35,
    color: '#ef3'
});
```

<img id="martin-ellipse" src="images/bunny.jpg" height="300" width="400">

### .text(`obj`)

Requires a string key `text` . Writes that text on one line. `obj` defaults to:

- `x` : 0
- `y` : 0
- `color` : black
- `size` : 16
- `align` : left
- `font` : 'Helvetica'

```js
canvas.text({
    text: 'Hello, world!',
    x: 140,
    y: 220,
    size: 20,
    color: '#fe0',
    font: 'Georgia'
});
```

<img id="martin-text" src="images/bunny.jpg">

<hr>

All of the above methods return the element, on which can be called other, element-specific methods:

### .remove()

Removes the element from its layer. It can then be added to another layer by calling `otherLayer.addElement(element)` . Returns the element.

### .bumpUp() / .bumpDown() / .bumpToTop() / .bumpToBottom()

Move the element around in the layer's stack of elements. Returns the element.

In the below example, calling `circle1.bumpUp()` has the same effect as calling `circle1.bumpToTop()` , and `circle2.bumpDown()` .

```js
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
// circle 1 is now above circle 2
```

<img id="martin-bump-up" src="images/bunny.jpg">

**In the above example, calling `circle2.bump2Bottom()` would effectively hide `circle2` from the viewer.** The reason for this is that, when a working canvas is created from an image, an element is created from that image. So the element stack for the above canvas, after running the example code, looks like:

- 0: `image` (bunny)
- 1: `circle` (blue circle)
- 2: `circle` (red circle)

### .moveTo(`x = 0`, `y = 0`)

Move an element in space on the canvas. `x` and `y` must be numbers (will be read as pixels from upper left 0) or percents as a string (ex. '50%').

For circles and ellipses, movement is relative to the center. For rectangles, relative to upper left. For lines, relative to the line's starting point. For polygons, relative to the first declared point. For text, the position depends on the alignment (left, center, or right).

```js
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

    // increment the time counter
    t++;

    // this would go much too fast if we call sin(t) directly,
    // so massage the numbers a bit
    var amount = 30 * Math.sin(t * Math.PI / 180)

    // move both circles
    circle1.moveTo( 0.5 * canvas.width(), 0.5 * canvas.height() + 30 * Math.sin(t) );
    circle2.moveTo( 0.5 * canvas.width(), 0.5 * canvas.height() + 30 * Math.sin(t) );

    // call the function again on the next animation frame
    // see: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    requestAnimationFrame(bounce);
})();
```

<img id="martin-move-to" src="images/bunny.jpg">
