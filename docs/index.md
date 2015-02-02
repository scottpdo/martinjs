<script src="js/martin.min.js"></script>

# Martin.js

Martin is a JavaScript library for working with HTML5 canvas.

## Loading Martin

Given an `<img>` or `<canvas>` element with `id="id"` , Martin is called with: ` Martin('id', init)`

In your callback function `init` , the first argument refers to the instance of Martin, on which you can call the available methods.

```
<img id="image" src="martin.jpg">
```

<img src="images/martin.jpg">

```
function init(canvas) {

    canvas.rect({
        offsetX: 130,
        offsetY: 20,
        width: 100,
        height: 100,
        color: '#000'
    }).opacity(0.75);

    canvas.toBW().convertToImage();

}

new Martin('image', init);
```
<img id="image" src="images/martin.jpg" width="250" height="250">
<script src="js/index.js"></script>
