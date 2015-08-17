# Effects

Martin.js comes with a number of built-in effects, which can be called from the working canvas (in which case it is added to the current layer), to a layer, or to a single element.

### .saturate(`amt`)

Makes colors appear more intense by `amount` (number, 0-100).

```
canvas.saturate(100);
```

<img id="martin-saturate" src="images/bunny.jpg">

### .desaturate(`amt`)

Makes colors appear less intense by `amount` (number, 0-100).

```
canvas.desaturate(80);
```

<img id="martin-desaturate" src="images/bunny.jpg">

### .lighten(`amount`)

Lightens by `amount` (number, 0-100).

```
canvas.lighten(25);
```

<img id="martin-lighten" src="images/bunny.jpg">

### .darken(`amount`)

Darkens by `amount` (number, 0-100).

```
canvas.darken(25);
```

<img id="martin-darken" src="images/bunny.jpg">

### .opacity(`amount`)

Sets the layer's or element's opacity to `amount` (0-100).

```
canvas.opacity(50);
```

<img id="martin-opacity" src="images/bunny.jpg">

### .blur(`amount`)

Places an `amount` px blur on the layer or element, following Mario Klingemann's [StackBlur algorithm](https://github.com/Quasimondo/QuasimondoJS/blob/master/blur/StackBlur.js).

```
canvas.blur(15);
```

<img id="martin-blur" src="images/bunny.jpg">

### .invert()

Inverts the layer or element's colors. Does not take any arguments.

```
canvas.invert();
```

<img id="martin-invert" src="images/bunny.jpg">

<hr>

All of the above methods return the `Effect`, on which can be called other, `Effect`-specific methods. **Any of the above `Effects`' intensity/amount can be retrieved as a key on the effect: `var intensity = effect.data`** .

### effect.increase(`amount = 1`)

Intensifies the `Effect` by `amount` (a number, relative to the effect's current intensity). If `amount` is left empty, increases the intensity by 1.

### effect.decrease(`amount = 1`)

Decreases the `Effect`'s intensity by `amount` (a number, relative to the effect's current intensity). If `amount` is left empty, decreases the intensity by 1.

```js
var effect = canvas.lighten(0);
var increasing = true;
(function flash() {
    var amount = effect.data;
    if ( increasing && amount < 100 ) {
        effect.increase();
    } else if ( increasing && amount === 100 ) {
        increasing = false;
        effect.decrease()

    // .lighten() and .darken() are the inverses of each other,
    // and so actually range between -100 and 100
    } else if ( !increasing && amount > -100 ) {
        effect.decrease();
    } else {
        increasing = true;
        effect.increase();
    }
    requestAnimationFrame(flash);
})();
```
<img id="martin-flash" src="images/bunny.jpg">

`Effects` can also be removed from their layer by calling:

### .remove()

```js
var effect = canvas.lighten(50);

// When the user clicks the canvas, remove the effect
canvas.click(function() {
    effect.remove();
});
```

<img id="martin-effect-remove" src="images/bunny.jpg">

New `Effects` can also be registered with:

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
