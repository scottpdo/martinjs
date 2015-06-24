# Overview

## How Martin.js Works

In order to make the most of Martin.js, you'll need to understand these three classes:

1. **Layers**
2. **Elements**
3. **Effects**

Similar to working with images in Photoshop, you can set up multiple layers in Martin.js and work on them individually. If one layer is "above" another, then you only see on the lower layer what's not covered by the higher layer.

**Layers** may contain **elements** and **effects**. An element is an image, geometric shape, or piece of text. An effect is a visual effect such as lightening or blurring that is placed on every element in the layer.

When you initialize, a base layer is automatically created. If you initialize from an existing `<canvas>` or `<img>`, any existing image data is automatically put into an element on the base layer.
