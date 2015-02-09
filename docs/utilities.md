# Utilities

### .convertToImage()

Merges all layers and converts the canvas to a downloadable image.

<img src="images/bunny.jpg" height="300" width="400">

### .newLayer(`arg = null`, `data = null`)

Adds a new layer on top of the current one and switches the drawing context to the new layer. If given an `arg` object, sets key-value pairs for the new layer. If given `data` as image data (for example, from another `<img>`), sets the pixel data for the new layer.

### .switchToLayer(`number = 0`)

Switches the drawing context to a given layer (ordered from 0 up).

### .duplicateLayer()

Duplicates the current layer and adds it to the top of the layer stack.

### .deleteLayer(`null` or `number`)

Deletes a given layer (by number), or the current layer, if no layer number is given.

### .height(`value`, `resize = false`)

Adjusts the height to be `value` pixels high, or by `value` percent (if given as a string, ex. '150%'). If `resize` is left empty or set to `false`, the image will be enlarged or cropped but not resized. This happens relative to the lower-left corner of the image. If `true`, the existing pixel data will be stretched or shrunk to the new height.

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

### .width(`value`, `resize = false`)

Adjusts the width to be `value` pixels wide, or by `value` percent (if given as a string, ex. '150%'). If `resize` is left empty or set to `false`, the image will be enlarged or cropped but not resized. This happens relative to the lower-left corner of the image. If `true`, the existing pixel data will be stretched or shrunk to the new width.

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
