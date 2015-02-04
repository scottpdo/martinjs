# Martin.js

Martin is a JavaScript library for working with HTML5 canvas. Martin supports jQuery-like chained methods, and makes photo manipulation and drawing in browser easy for developers and users.

**Martin is in pre-release beta, so features are subject to change.**

You can download Martin here:

- [Full version (19 kb)](js/src/martin.js)
- [Minified (9 kb)](js/src/martin.min.js)

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
        offsetY: 35
    });

    canvas.toBW().convertToImage();

}

new Martin('image', init);
```
<img id="image" src="images/martin.jpg" width="250" height="250">

It's an image! Go ahead - drag it to your desktop.
