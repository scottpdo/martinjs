# Photo Manipulation

**Important: As of v0.1.0, none of these operations are reversible. As always, it's safest to create new layers and edit those if you may later want to retrieve old pixel data.**

### .toBW(`all = false`)

Converts the current layer to black and white. If `all` is set to `true`, will convert all layers to black and white.

```
canvas.toBW();
```

<img id="martin-tobw" src="images/bunny.jpg" height="300" width="400">

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
