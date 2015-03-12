# Plugins

Similar to jQuery, you can extend Martin's functionality by adding new methods.

A working example is `martin-watermark` . Include it after the main Martin script:

```
<script src="martin.js"></script>
<script src="martin-watermark.js"></script>
```

Then use the plugin's new methods as you normally would when loading Martin:

```
function init(canvas) {
    canvas.watermark('Photo credit: Scottland Donaldson');
}

Martin('image', init);
```

<img id="martin-watermark" src="images/bunny.jpg" width="400" height="300">

### .extend(`obj`)

Give function names as keys and function as values. In your function, `this` is bound to the instance of Martin, and all existing methods are available for use. Example `martin-watermark` below:

```
Martin.extend({

    watermark: function(text, color, size) {

        // default to the copyright symbol
        text = text || '\u00A9';
        color = color || '#fff';
        size = size || 12;
        var padding = 2;
        var style = {
            align: 'right',
            color: color,
            offsetX: this.canvas.width - padding,
            offsetY: padding,
            size: size
        };

        this.write(text, style);

        return this;
    }

});
```
