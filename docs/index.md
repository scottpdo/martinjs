<script src="js/martin.min.js"></script>

# Martin.js

Martin is a JavaScript library for working with HTML5 canvas. Martin is still in pre-release alpha, but if you're interested, read through the docs here and let me know if you have any questions.

\- Scottland / [@scottpdonaldson](https://twitter.com/scottpdonaldson)

## Loading Martin

Given an `<img>` or `<canvas>` element with `id="id"` , Martin is called with: `new Martin('id', init)`

In your callback function `init` , the first argument refers to the instance of Martin, on which you can call the available methods.

## Example

```
<img id="image" src="martin.jpg">
```

<img src="images/martin.jpg">

```
function init(canvas) {

    canvas.rect({
        offsetX: 130,
        offsetY: 20,
        width: 90,
        height: 50,
        color: '#fff'
    });

    canvas.write({
        text: 'Hi Martin',
        offsetX: 145,
        offsetY: 50
    });

    canvas.toBW().convertToImage();

}

new Martin('image', init);
```
<img id="image" src="images/martin.jpg" width="250" height="250">
<script src="js/index.js"></script>

It's an image! Go ahead - drag it to your desktop.
