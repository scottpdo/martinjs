## Layers

**From the working canvas**, a layer will be returned from the following methods. At any given moment, the working canvas has a **current layer**, and any new elements or effects called from the working canvas are added to the current layer. Elements or effects called from a layer are always added to that layer.

### canvas.newLayer()

Creates a new layer at the top of the layer stack and retrieves that layer.

```js
var layer1 = canvas.newLayer();

layer1 === canvas.currentLayer;
// true

var layer2 = canvas.newLayer();

layer1 === canvas.currentLayer;
// now this is false:
// layer2 is the current layer
```

### canvas.layer(`i`)

Retrieve and switch the current layer to the layer at index `i`. If `i` is not given, retrieve the bottom-most layer.

```js
var canvas = Martin('canvas'), // instantiates with a base layer (0)
    baseLayer = canvas.layer(0),
    newLayer = canvas.newLayer();

canvas.layer(0); // switches context to the base layer
var sameLayer = canvas.layer(1);

sameLayer === newLayer; // true
```

<hr>

Once a layer has been retrieved, you can call the following methods **on the layer**:

### layer.clear()

Clears the layer of all pixel data, but remembers elements and effects. The layer remains on the working canvas. Returns the layer.

### layer.remove()

Removes the layer from the working canvas (it will no longer be rendered), but remembers elements and effects. Returns the layer.

### layer.bump(`i`)

Bumps the layer to position `i` (a number), with `0` being the bottom layer. Returns the layer.

### layer.bumpUp()

Bumps the layer up in the layer stack. Returns the layer.

### layer.bumpDown()

Bumps the layer down in the layer stack. Returns the layer.

### layer.bumpToTop()

Bumps the layer to the top of the layer stack. Returns the layer.

### layer.bumpToBottom()

Bumps the layer to the bottom of the layer stack. Equivalent to calling `layer.bump(0)`. Returns the layer.
