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

All of the above methods return the effect, on which can be called other, effect-specific methods. **Any effect's intensity/amount can be retrieved as a key on the effect: `var intensity = effect.amount`** .

### .increase(`amount = 1`)

Intensifies the effect by `amount` (a number, relative to the effect's current intensity). If `amount` is left empty, increases the intensity by 1.

### .decrease(`amount = 1`)

Decreases the effect's intensity by `amount` (a number, relative to the effect's current intensity). If `amount` is left empty, decreases the intensity by 1.

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
