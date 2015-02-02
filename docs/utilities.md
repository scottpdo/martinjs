# Utilities

### .convertToImage()

Merges all layers and converts the canvas to a downloadable image.

### .newLayer(`arg = null`, `data = null`)

Adds a new layer on top of the current one and switches the drawing context to the new layer. If given an `arg` object, sets key-value pairs for the new layer. If given `data` as image data (for example, from another `<img>`), sets the pixel data for the new layer.

### .switchToLayer(`number = 0`)

Switches the drawing context to a given layer (ordered from 0 up).
