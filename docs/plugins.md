# Plugins

New elements can be registered with:

### Martin.registerElement(`name`, `cb`)

`name` should be a string that will allow the new element to be called with `canvas.name()` or `layer.name()` .

`cb` should be a callback function that describes how the element should be drawn on its layer. It will be helpful to use `this.context` inside the callback function to refer to the drawing context.

`cb` takes a single parameter, an object with key-value pairs that will be automatically set on the element and can be used within the rendering function.

```js
Martin.registerElement('myNewElement', function(data) {
    // in the body of this function, describe how
    // the element will be drawn
});
```

**Example:**

```js
Martin.registerElement('star', function(data) {
    // let data.size be the radius of the star
    var size = data.size,
        centerX = data.x,
        centerY = data.y;

    var context = this.context;

    // convert these angles to radians
    var angles = [54, 126, 198, 270, 342];
    angles = angles.map(Martin.degToRad);

    angles.forEach(function(angle, i) {

        // find the angle that is halfway between the current and next angle
        var next = angles[i + 1] || angle + Martin.degToRad(72),
            average = 0.5 * (angle + next);

        // draw a long line to the first point
        context.lineTo(centerX + Math.cos(angle) * size, centerY + Math.sin(angle) * size);
        // and a short line to the second
        context.lineTo(centerX + Math.cos(average) * size / 2.5, centerY + Math.sin(average) * size / 2.5);
    });

    // once we're done, bring our line back to the first point
    context.lineTo(centerX + Math.cos(angles[0]) * size, centerY + Math.sin(angles[0]) * size);
    // and close the path
    context.closePath();
});

// since this is an element, it can take all of the usual
// attributes that are applied to elements
var star = canvas.star({
    color: '#f00',
    stroke: '#000',
    strokeWidth: 10,
    size: 50,
    x: '50%',
    y: '50%'
});

// it can also be updated just like any other element
canvas.mousemove(function(e) {
    star.moveTo(e.offsetX, e.offsetY);
})
```

<canvas id="martin-plugins-star" width="500" height="300"></canvas>

New `Effects` can be registered with:

### Martin.registerEffect(`name`, `cb`)

`name` should be a string that will allow the new `Effect` to be called with `canvas.name()`.

`cb` should be a callback function that describes how the `Effect` manipulates the canvas. The best way to use this is to use the `Layer.loop()` function.

```js
// Register an effect with a name and a callback function that takes a
// single parameter, data, which will dictate how the effect interacts with the canvas
Martin.registerEffect('myNewEffect', function(data) {

    // this.context, when used within the callback of Martin.registerEffect,
    // refers to either the element or layer on which the effect
    // was called
    this.context.loop(function(x, y, pixel) {

        // x and y are the pixel's coordinates, from the upper-left, starting with 0
        // pixel is an object with keys r, g, b, a representing its
        // red, green, blue, and alpha values, all clamped between 0 and 255
        pixel.r;
        pixel.g;
        pixel.b;
        pixel.a;

        // These values can be mutated
        pixel.r = 200;
        pixel.g += 5 + data.a;
        pixel.b -= Math.round(data.b / 2);

        // To make sure the changes are saved, return the
        // pixel object at the end.
        return pixel;
    });
});

// After having registered the new effect, call it
// on the working canvas, a layer, or an element
var params = {
    a: 100,
    b: 100
};

canvas.myNewEffect(params); // or
layer.myNewEffect(params); // or
element.myNewEffect(params);
```

<img id="martin-my-new-effect" src="images/bunny.jpg">
