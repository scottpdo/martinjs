# Drawing

### .background(`color`)

Adds a new layer at 0 (bumping all other existing layers up by 1 in the order) and fills that layer with `color` . If there is already a background layer, refills that layer with `color` . Does not change the drawing context.

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

### .polygon(`arr`, `obj`)

`arr` must be an array of arrays, where each nested array represents a point of the polygon. Points may be numbers, percentages, or mixed (ex. `arr = [[20, 40], ['10%', '50%'], [80, '75%']]` ).

`obj` accepts the same optional key-value pairs as `.rect()` , with the same defaults.


### .circle(`obj`)

Requires `offsetX`, `offsetY`, `radius` (`radius` may only be a number, *not* a percent as string).

Same options and defaults as `.rect()` .

### .ellipse(`obj`)

Requires `offsetX`, `offsetY`, `radiusX`, `radiusY` (the two radii may only be numbers).

Same options and defaults as `.rect()` .

### ** --EXPERIMENTAL-- ** .gradient()
