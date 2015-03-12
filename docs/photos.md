# Photo Manipulation

**Important: As of v0.1.2, none of these operations are reversible. As always, it's safest to create new layers and edit those if you may later want to retrieve old pixel data.**

### .saturate(`amt`, `all = false`)

Saturate the canvas, making colors appear more intense, by `amount` (number, 0-100). If `all` is set to `true`, will saturate all layers by `amount` .

```
canvas.saturate(100);
```

<img id="martin-saturate" src="images/bunny.jpg" height="300" width="400">

### .desaturate(`amt`, `all = false`)

Desaturate the canvas, making colors appear less intense, by `amount` (number, 0-100). If `amount` is 100, will convert the image to black and white. If `all` is set to `true`, will desaturate all layers by `amount` .

```
canvas.desaturate(80);
```

<img id="martin-desaturate" src="images/bunny.jpg" height="300" width="400">

### .lighten(`amount`, `all = false`)

Lightens the current layer by `amount` (number, 0-100). If `all` is set to `true`, will lighten all layers by `amount`.

```
canvas.lighten(25);
```

<img id="martin-lighten" src="images/bunny.jpg" height="300" width="400">

### .darken(`amount`, `all = false`)

Darkens the current layer by `amount` (number, 0-100). If `all` is set to `true`, will darken all layers by `amount`.

```
canvas.darken(25);
```

<img id="martin-darken" src="images/bunny.jpg" height="300" width="400">

### .opacity(`amount`, `all = false`)

Sets the current layer opacity to `amount` (0-1). If `all` is set to `true`, sets all layer opacities to `amount` .

```
canvas.opacity(0.5);
```

<img id="martin-opacity" src="images/bunny.jpg" height="300" width="400">

### .blur(`amount`, `all = false`)

Places an `amount` px blur on the current layer, following Mario Klingemann's [StackBlur algorithm](https://github.com/Quasimondo/QuasimondoJS/blob/master/blur/StackBlur.js). If `all` is set to `true`, places an `amount` px blur on all layers.

```
canvas.blur(15);
```

<img id="martin-blur" src="images/bunny.jpg" height="300" width="400">
