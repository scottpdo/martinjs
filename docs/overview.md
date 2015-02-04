# Overview

## How Martin Works

Martin uses layers, similar to working with images in Photoshop. When you load a canvas or image element, it is set to layer 0, and you can start editing or drawing from there.

Whenever you edit a layer, that layer's pixel data is altered. In the example below, when we draw a blue rectangle directly on top of the working layer, the pixels representing the bunny are replaced by the blue rectangle. The bunny is gone forever.

<img src="images/martin.jpg" width="250" height="250">

```
function init(canvas) {

    canvas.rect({
        offsetX: 25,
        offsetY: 25,
        width: 90,
        height: 50,
        color: '#33e' // blue
    });

}

new Martin('image', init);
```

<img id="martin-overview" src="images/martin.jpg" width="250" height="250">

A better practice would be to create a new layer and work there. Then the pixel data on lower layers is still retrievable in case it's needed.
