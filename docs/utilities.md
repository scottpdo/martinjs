# Utilities

### .convertToImage(`preserve = false`)

Merges all the layers.

If `preserve` is set to `true`, the layers will all remain intact (and able to be further edited), and it returns a data URL representing the merged layers. This can be set as the `src` of some image, opened as a link in a new tab, or downloaded.

If `preserve` is set to `false` or left empty, this will merge and destroy the existing layers and replace the working canvas with an image whose `src` is the above data URL.

```js
canvas.convertToImage(true);
```

Returns:

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEsCAYAAADtt+XCAAAgAElEQ…AhmOkBkzZBB5jvYB+rK1vlMqtQ1ArpK8ABM2mg9b9244b8P3MPH12RU3nkAAAAAElFTkSuQmCC
```

<hr>

```js
canvas.convertToImage();
```

Returns:

<img src="images/bunny.jpg" height="300" width="400">

### .newLayer(`arg = null`, `data = null`)

Adds a new layer on top of the current one and switches the drawing context to the new layer. If given an `arg` object, sets key-value pairs for the new layer. If given `data` as image data (for example, from another `<img>`), sets the pixel data for the new layer.

### .switchToLayer(`number = 0`)

Switches the drawing context to a given layer (ordered from 0 up).

### .duplicateLayer()

Duplicates the current layer and adds it to the top of the layer stack.

### .deleteLayer(`null` or `number`)

Deletes a given layer (by number), or the current layer, if no layer number is given.

### .height(`null` or `value`, `resize = false`)

If no argument is passed, returns the height as a number.

If a value is given, adjusts the height to be `value` pixels high, or by `value` percent (if given as a string, ex. '150%'). If `resize` is left empty or set to `false`, the image will be enlarged or cropped but not resized. This happens relative to the lower-left corner of the image. If `true`, the existing pixel data will be stretched or shrunk to the new height.

```
canvas.height(200); // crop
```

<img id="martin-height-200-crop" src="images/bunny.jpg" height="300" width="400">

```
canvas.height(200, true); // resize
```

<img id="martin-height-200-resize" src="images/bunny.jpg" height="300" width="400">

```
canvas.height(400, true); // resize
```

<img id="martin-height-400-resize" src="images/bunny.jpg" height="300" width="400">

### .width(`null` or `value`, `resize = false`)

If no argument is passed, returns the width as a number.

If a value is given, adjusts the width to be `value` pixels wide, or by `value` percent (if given as a string, ex. '150%'). If `resize` is left empty or set to `false`, the image will be enlarged or cropped but not resized. This happens relative to the lower-left corner of the image. If `true`, the existing pixel data will be stretched or shrunk to the new width.

```
canvas.width(200); // crop
```

<img id="martin-width-200-crop" src="images/bunny.jpg" height="300" width="400">

```
canvas.width(200, true); // resize
```

<img id="martin-width-200-resize" src="images/bunny.jpg" height="300" width="400">

```
canvas.width(500, true); // resize
```

<img id="martin-width-500-resize" src="images/bunny.jpg" height="300" width="400">
