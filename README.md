# Martin.js

Martin.js is a JavaScript library for working with HTML5 canvas, to make photo manipulation and drawing in browser easy for developers and users.

## Installation and Initializing

`bower install martinjs`

Bower will download and install minified and un-minified versions in the `js/dist` folder (`martin.min.js` and `martin.js`, respectively), as well as source files in the `js/src` folder.

In the `<head>` of your document, include Martin.js:

```html
<script src="/path/to/martin.min.js"></script>
```

Then, after including Martin.js, you can initialize it from a `<canvas>`, `<img>`, or independently (to later include it in your document).

```js
// Grab a <canvas> or <img> with id="id" and instantiate from it
var canvas = Martin('id');

// Grab an element and pass it in
var myImage = document.getElementsByTagName('img')[0];
var myCanvas = Martin(myImage);

// You can then call the available methods!
canvas.newLayer();
canvas.text({
    text: 'Hello!',
    font: 'Futura'
});

myCanvas.saturate(25);
```

**Important:** If you are calling Martin from an `<img>` element, it must be hosted on the some domain that you are running your code from. This is due to `<canvas>` not allowing manipulation of image data from cross-origin resources. ([There is a workaround](http://keithwyland.com/2013/09/29/Canvas-CORS-Codepen.html), but it requires proper CORS header being sent as well as specifying that the `<img>` uses cross-origin data)

## Contributing

Clone this repository and run `npm install` to download dependencies. Once those have downloaded, running `gulp` will set up the development environment and automatically open `localhost:3000` in your browser of choice.

**Do not change any code in the `js/dist` directory.** All files there are automatically generated based on code in the `js/src` directory, and you should only make changes there.

Unit tests are not comprehensive (yet!), but before submitting a pull request, visit `localhost:3000/test` to make sure that all tests are passing.

## Documentation

To build documentation, run `mkdocs serve`. This will set up a server at `localhost:8000`. [MkDocs](http://www.mkdocs.org) builds the documentation, with configuration in the root `mkdocs.yml`, and all pages and included js/images in `docs/`.
