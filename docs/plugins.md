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
    var size = data.size;
});
```

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
