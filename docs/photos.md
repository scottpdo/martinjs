# Photo Manipulation

### .height(`num`, `resize = false`)

Adjusts the height to be `num` pixels high. If `resize` is left empty or set to `false`, the image will be enlarged or cropped but not resized. If `true`, the existing pixel data will be stretched or shrunk to the new height.

### .width(`num`, `resize = false`)

Adjusts the width to be `num` pixels wide. If `resize` is left empty or set to `false`, the image will be enlarged or cropped but not resized. If `true`, the existing pixel data will be stretched or shrunk to the new width.

### .crop() `// TODO`

### .toBW(`all = false`)

Converts the current layer to black and white. If `all` is set to `true`, will convert all layers to black and white.

### .lighten(`amount`, `all = false`)

Lightens the current layer by `amount` (0-100%). If `all` is set to `true`, will lighten all layers by `amount`.

### .darken(`amount`, `all = false`)

Darkens the current layer by `amount` (0-100%). If `all` is set to `true`, will darken all layers by `amount`.

### .opacity(`amount`)

Sets the current layer opacity to `amount` (0-1).
