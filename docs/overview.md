# Overview

## How Martin.js Works

In order to make the most of Martin.js, you'll need to understand these three object types:

1. **Layers**
2. **Elements**
3. **Effects**

Similar to working with images in Photoshop, you can set up multiple layers in Martin.js and work on them individually. If one layer is "above" another, then you only see on the lower layer what's not covered by the higher layer.

**Layers** may contain **elements** and **effects**. An element is an image, geometric shape, or piece of text. An effect is a visual effect such as lightening or blurring. Effects can be applied to layers, altering the appearance of all the layer's elements, or only to a single element on a layer.

When you initialize, a base layer is automatically created. If you initialize from an existing `<canvas>` or `<img>`, any existing image data is automatically put into an element on the base layer.

## Rendering

If you instantiate without any `options` , any changes you make will automatically appear on the canvas. For example, if you call `canvas.darken(25)` , you will see it darken immediately. However, if you instantiate like this:

```js
var canvas = Martin('canvas', {
    autorender: false
});
```

Then any changes you make will not immediately appear. You will need to call `canvas.render()` after making your changes in order to see them take place. This is most useful when animating multiple elements on a canvas &mdash; since each individual change re-renders the canvas, if you are making several changes with each animation frame, it is more efficient to render all the changes in one fell swoop.

See the below canvas for a performance comparison. Initially, `autorender` is set to `false` , and performance should be relatively smooth. Click the canvas to toggle `autorender` off and on again to see changes in performance.

<canvas id="martin-autorender"></canvas>

&nbsp;
