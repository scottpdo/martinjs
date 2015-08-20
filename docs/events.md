# Events

You can listen for a number of mouse events, and attach functions to run when those events are fired on the working canvas. In your callback function, include a single parameter for the `Event` object, which contains keys `x` and `y` (as well as the usual `MouseEvent` keys), corresponding to the mouse's coordinates over the working canvas.

If you use the `.on()` method instead of the shorthand, you can attach listeners for multiple events by calling `.on('event1 event2 event3', callback)` , with events separated by spaces.

### .click(`callback`) or .on('click', `callback`)

```js
// CLICK TO TOGGLE A BLUR

var blurred = false,
    effect = canvas.blur(0); // don't actually blur, but add an effect
canvas.click(function() {
    if ( !blurred ) {
        effect.increase(20);
        blurred = true;
    } else {
        effect.decrease(20);
        blurred = false;
    }
});
```
<img id="martin-click" src="images/bunny.jpg">

### .mouseover(`callback`) or .on('mouseover', `callback`)
### .mouseout(`callback`) or .on('mouseout', `callback`)

```js
// Mousing over and mousing out of the canvas will move
// the circle to random coordinates on the canvas
var circle = canvas.circle({
    x: Math.random() * canvas.width(),
    y: Math.random() * canvas.height(),
    radius: 50,
    color: '#00f'
});

canvas.on('mouseover mouseout', function() {
    // move the circle to random coordinates on the canvas
    circle.moveTo( Math.random() * canvas.width(), Math.random() * canvas.height() );
});
```
<img id="martin-mouseover" src="images/bunny.jpg">

### .mouseenter(`callback`) or .on('mouseenter', `callback`)
### .mouseleave(`callback`) or .on('mouseleave', `callback`)

Read about the differences between `mouseenter` and `mouseover` / `mouseleave` and `mouseout` [here](http://www.quirksmode.org/js/events_mouse.html).

### .mousedown(`callback`) or .on('mousedown', `callback`)
### .mouseup(`callback`) or .on('mouseup', `callback`)

```js
function randomCircle() {

    // generate a random color and size
    var hex = '0123456789abcdef';
    var radius = Math.random() * 50,
        r = hex[Math.floor(Math.random() * hex.length)],
        g = hex[Math.floor(Math.random() * hex.length)],
        b = hex[Math.floor(Math.random() * hex.length)];

    canvas.circle({
        radius: radius,
        color: '#' + r + g + b,
        x: Math.random() * canvas.width(),
        y: Math.random() * canvas.height()
    });
}
// fire once for good measure :-)
randomCircle();
canvas.on('mousedown mouseup', randomCircle);
```

<img id="martin-mousedown" src="images/bunny.jpg">

### .mousemove(`callback`) or .on('mousemove', `callback`)

```js
// Move the mouse to move the text
var text = canvas.text({
    text: 'Follow that mouse!',
    x: '50%',
    y: '50%',
    color: '#fff',
    size: 24,
    align: 'center'
});

canvas.mousemove(function(e) {
    text.moveTo(e.x, e.y);
});
```

<img id="martin-mousemove" src="images/bunny.jpg">
