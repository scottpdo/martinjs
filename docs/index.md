<div style="float: right;"><iframe src="https://ghbtns.com/github-btn.html?user=scottdonaldson&repo=martin&type=star&count=true" frameborder="0" scrolling="0" width="90" height="20"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=scottdonaldson&repo=martin&type=watch&count=true&v=2" frameborder="0" scrolling="0" width="90" height="20"></iframe></div>

# Martin.js

Martin is a JavaScript library for working with HTML5 canvas. Martin supports jQuery-like chained methods, and makes photo manipulation and drawing in browser easy for developers and users.

**Martin is in pre-release beta, so features are subject to change.**

You can download Martin here:

- [Full version (19 kb)](download/martin.js)
- [Minified (10 kb)](download/martin.min.js)

\- Scottland / [@scottpdonaldson](https://twitter.com/scottpdonaldson)

## Loading Martin

Given an `<img>` or `<canvas>` element with `id="id"` , Martin is called with: `new Martin('id', init)`

In your callback function `init` , the first argument refers to the instance of Martin, on which you can call the available methods.

## Example

```
<img id="image" src="bunny.jpg">
```

<img src="images/bunny.jpg">

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
        text: 'Hello!',
        size: 18,
        offsetX: 145,
        offsetY: 35
    });

    canvas.desaturate(100).convertToImage();

}

new Martin('image', init);
```
<img id="image" src="images/bunny.jpg" width="400" height="300">

It's an image! Go ahead - drag it to your desktop.
