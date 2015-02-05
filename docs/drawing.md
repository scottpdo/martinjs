# Drawing

### .background(`color`)

Adds a new layer at 0 (bumping all other existing layers up by 1 in the order) and fills that layer with `color` . If there is already a background layer, refills that layer with `color` . Does not change the drawing context.

```
// set opacity to 0.5, then drop in a red background

canvas.opacity(0.5).background('#f00')
```

<img id="martin-background" src="images/bunny.jpg" height="300" width="400">

### .line(`obj`)

`obj` must have key-value pairs for:

* `startX`
* `startY`
* `endY`
* `endX`

For all of the above, value must be a number (will be read as pixels from lower left 0) or a percent as a string (ex. '50%').

Optional:

* `strokeWidth` (defaults to 1)
* `color` (defaults to black)
* `cap` (defaults to square)

```
canvas.line({
    startX: 40,
    startY: 100,
    endX: '100%',
    endY: 0,
    strokeWidth: 10,
    color: '#fff',
    cap: 'round'
});
```

<img id="martin-line" src="images/bunny.jpg" height="300" width="400">

### .rect(obj)

`obj` must have key-value pairs for:

* `offsetX`
* `offsetY`
* `width`
* `height`

For all of the above, value must be a number (will be read as pixels from lower left 0) or a percent as a string (ex. '50%').

Optional:

* `color` (defaults to black)
* `strokeWidth` (defaults to 0)
* `stroke` (defaults to transparent)

```
canvas.rect({
    offsetX: '60%',
    offsetY: 20,
    width: '40%',
    height: 260,
    color: '#ff0'
});
```

<img id="martin-rect" src="images/bunny.jpg" height="300" width="400">

### .polygon(`arr`, `obj` or `color`)

`arr` must be an array of arrays, where each nested array represents a point of the polygon. Points may be numbers, percentages, or mixed (ex. `arr = [[20, 40], ['10%', '50%'], [80, '75%']]` ).

`obj` accepts the same optional key-value pairs as `.rect()` , with the same defaults. Alternatively, the second parameter can be a color string, which will fill the polygon with that solid color.

```
canvas.polygon(
    [
        ['20%', '10%'],
        ['40%', '40%'],
        ['20%', '40%']
    ], '#fff'); // white

canvas.polygon(
    [
        [300, 200],
        [350, 200],
        [300, 250],
        [250, 250]
    ], {
        color: '#00f', // blue fill
        strokeWidth: 2,
        stroke: '#000' // black stroke
    });
```

<img id="martin-polygon" src="images/bunny.jpg" height="300" width="400">

### .circle(`obj`)

Requires `offsetX`, `offsetY`, `radius` (`radius` may only be a number, *not* a percent as string).

Same options and defaults as `.rect()` .

```
canvas.circle({
    offsetX: 300,
    offsetY: 250,
    radius: 35,
    color: '#ef3'
});
```

<img id="martin-circle" src="images/bunny.jpg" height="300" width="400">

### .ellipse(`obj`)

Requires `offsetX`, `offsetY`, `radiusX`, `radiusY` (the two radii may only be numbers).

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
