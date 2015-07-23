# Effects

**From the working canvas**, an effect will be returned from the following methods. Effects are added to the working layer, and affect only the elements on that layer.

All effects accept a number between 0 (no effect) and 100 inclusive, except for `.blur()` , which accepts a number up to 256.

### .saturate(`amt`)

Saturates the current layer, making colors appear more intense, by `amount` (number, 0-100).

```
canvas.saturate(100);
```

<img id="martin-saturate" src="images/bunny.jpg">

### .desaturate(`amt`)

Desaturate the current layer, making colors appear less intense, by `amount` (number, 0-100).

```
canvas.desaturate(80);
```

<img id="martin-desaturate" src="images/bunny.jpg">

### .lighten(`amount`)

Lightens the current layer by `amount` (number, 0-100).

```
canvas.lighten(25);
```

<img id="martin-lighten" src="images/bunny.jpg">

### .darken(`amount`)

Darkens the current layer by `amount` (number, 0-100).

```
canvas.darken(25);
```

<img id="martin-darken" src="images/bunny.jpg">

### .opacity(`amount`)

Sets the current layer opacity to `amount` (0-100).

```
canvas.opacity(50);
```

<img id="martin-opacity" src="images/bunny.jpg">

### .blur(`amount`)

Places an `amount` px blur on the current layer, following Mario Klingemann's [StackBlur algorithm](https://github.com/Quasimondo/QuasimondoJS/blob/master/blur/StackBlur.js).

```
canvas.blur(15);
```

<img id="martin-blur" src="images/bunny.jpg">

<hr>

All of the above methods return the `Effect`, on which can be called other, `Effect`-specific methods. **Any of the above `Effects`' intensity/amount can be retrieved as a key on the effect: `var intensity = effect.data`** .

### .increase(`amount = 1`)

Intensifies the `Effect` by `amount` (a number, relative to the effect's current intensity). If `amount` is left empty, increases the intensity by 1.

### .decrease(`amount = 1`)

Decreases the `Effect`'s intensity by `amount` (a number, relative to the effect's current intensity). If `amount` is left empty, decreases the intensity by 1.

```js
var effect = canvas.lighten(0);
var increasing = true;
(function flash() {
    var amount = effect.amount;
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

    // `this` refers to the instance of Martin when called,
    // and `this.currentLayer` is the working layer of the canvas
    this.currentLayer.loop(function(x, y, pixel) {

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

    // To make the effect chainable, finish it off with...
    return this;
});

// After having registered the new effect, call it on the instance of Martin
canvas.myNewEffect({
    a: 100,
    b: 100
});
```

<img id="martin-my-new-effect" src="images/bunny.jpg">
