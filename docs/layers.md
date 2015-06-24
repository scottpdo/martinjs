## Layers

**From the working canvas**, a layer will be returned from the following methods. At any given moment, the working canvas has a **current layer**, and any new elements or effects are added to the current layer.

### .layer(`i`)

Retrieve and switch the current layer to the layer at index `i`. If `i` is not given, retrieve the bottom-most layer.

### canvas.newLayer()

Creates a new layer at the top of the layer stack and retrieves that layer.

Once a layer has been retrieved, you can call the following methods **on the layer**:

### .clear()

Clears the layer of all pixel data, but remembers elements and effects. The layer remains on the working canvas. Returns the layer.

### .remove()

Removes the layer from the working canvas (it will no longer be rendered), but remembers elements and effects. Returns the layer.

### .addElement(`element`)

Given a `Martin.Element` element, adds that element to the top of the layer's elements. Returns the layer.
