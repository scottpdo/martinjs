# Overview

## How Martin Works

Martin uses layers, similar to working with images in Photoshop. When you load a canvas or image element, it is set to layer 0, and you can start editing or drawing from there.

Whenever you edit a layer, that layer's pixel data is altered. In the example below, when we draw a blue rectangle directly on top of the working layer, the pixels representing the bunny are replaced by the blue rectangle. The bunny is gone forever.

<img src="images/bunny.jpg" width="400" height="300">

```
function init(canvas) {

    canvas.rect({
        offsetX: 150,
        offsetY: 25,
        width: 200,
        height: 250,
        color: '#33e' // blue
    });

}

new Martin('image', init);
```

<img id="martin-overview" src="images/bunny.jpg" width="400" height="300">

A better practice would be to create a new layer and work there. Then the pixel data on lower layers is still retrievable in case it's needed.
