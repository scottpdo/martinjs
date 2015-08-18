# Utilities

### canvas.render()

Renders the canvas. If you set `autorender: false` when including `options` , you **must** call this to see any changes made to the canvas.

### canvas.toDataURL()

Similar to the native canvas `.toDataURL()` method, this returns a data URL (beginning with `data:img/png;base64,`) that can be set as the `src` of some image, opened in a new tab, or downloaded.

```js
canvas.toDataURL();
```

Returns:

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEsCAYAAADtt+XCAAAgAElEQ…AhmOkBkzZBB5jvYB+rK1vlMqtQ1ArpK8ABM2mg9b9244b8P3MPH12RU3nkAAAAAElFTkSuQmCC
```

### canvas.convertToImage()

Replaces the working canvas and layers with an image whose `src` is the data URL returned by the `.toDataURL()` method.

```js
canvas.convertToImage();
```

Returns:

<img src="images/bunny.jpg" height="300" width="400">

### canvas.height(`null` or `value`, `resize = false`)

If no argument is passed, returns the height as a number.

If a value is given, adjusts the height to be `value` pixels high, or by `value` percent (if given as a string, ex. '150%'). If `resize` is left empty or set to `false`, the image will be enlarged or cropped but not resized. This happens relative to the upper-left corner of the image. If `true`, the existing pixel data will be stretched or shrunk to the new height.

```js
canvas.height(200); // crop
```

<img id="martin-height-200-crop" src="images/bunny.jpg">

```js
canvas.height(200, true); // resize
```

<img id="martin-height-200-resize" src="images/bunny.jpg">

```js
canvas.height(400, true); // resize
```

<img id="martin-height-400-resize" src="images/bunny.jpg">

### canvas.width(`null` or `value`, `resize = false`)

If no argument is passed, returns the width as a number.

If a value is given, adjusts the width to be `value` pixels wide, or by `value` percent (if given as a string, ex. '150%'). If `resize` is left empty or set to `false`, the image will be enlarged or cropped but not resized. This happens relative to the lower-left corner of the image. If `true`, the existing pixel data will be stretched or shrunk to the new width.

```js
canvas.width(200); // crop
```

<img id="martin-width-200-crop" src="images/bunny.jpg">

```js
canvas.width(200, true); // resize
```

<img id="martin-width-200-resize" src="images/bunny.jpg" height="300" width="400">

```js
canvas.width(500, true); // resize
```

<img id="martin-width-500-resize" src="images/bunny.jpg" height="300" width="400">
