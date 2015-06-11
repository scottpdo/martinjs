/*
 *
 * Initialize an empty instance of Martin.
 *
 */

describe('Initializing an empty instance of Martin', function() {

    var canvas = Martin(),
        baseLayer = canvas.layers[0];

    it('sets key canvas: HTML node canvas', function() {
        expect(canvas.canvas.tagName).toBe('CANVAS');
    });

    it('sets key context: CanvasRenderingContext2D', function() {
        expect(canvas.context instanceof CanvasRenderingContext2D).toBe(true);
    });

    it('sets a base layer', function() {
        expect(canvas.layers.length).toBe(1);
    });

    it('...ith its own key canvas: HTML node canvas', function() {
        expect(baseLayer.canvas.tagName).toBe('CANVAS');
    });

    it('..with its own key context: CanvasRenderingContext2D', function() {
        expect(baseLayer.context instanceof CanvasRenderingContext2D).toBe(true);
    });

});

/*
 *
 * Initialize an instance of Martin from an image.
 *
 */

describe('Initializing an instance of Martin from an image', function() {

    // get image
    var img = document.createElement('img');
    img.src = '../images/humphrey.jpg';
    img.id = 'dummy';
    img.style.display = 'none';
    document.body.appendChild(img);

    // create instance of Martin from image
    var canvas = Martin('dummy');
    canvas.canvas.style.display = 'none';

    var baseLayer = canvas.layers[0];

    it('sets key canvas: HTML node canvas', function() {
        expect(canvas.canvas.tagName).toBe('CANVAS');
    });

    it('sets a canvas width', function() {
        expect(canvas.canvas.width).toBeGreaterThan(0);
    });

    it('sets a canvas height', function() {
        expect(canvas.canvas.height).toBeGreaterThan(0);
    });

    it('sets key context: CanvasRenderingContext2D', function() {
        expect(canvas.context instanceof CanvasRenderingContext2D).toBe(true);
    });

    it('sets a base layer', function() {
        expect(canvas.layers.length).toBe(1);
    });

    it('..with its own key canvas: HTML node canvas', function() {
        expect(baseLayer.canvas.tagName).toBe('CANVAS');
    });

    it('..with its own key context: CanvasRenderingContext2D', function() {
        expect(baseLayer.context instanceof CanvasRenderingContext2D).toBe(true);
    });

    it('..with a single element', function() {
        expect(baseLayer.elements.length).toBe(1);
        expect(baseLayer.elements[0] instanceof Martin.Element).toBe(true);
    });

    it('....whose type is image', function() {
        expect(baseLayer.elements[0].type).toBe('image');
    });

});

/*
 *
 * Initialize an instance of Martin from a canvas.
 *
 */

 describe('Initializing an instance of Martin from a 400x200 canvas', function() {

     // get image
     var canvas = document.createElement('canvas');
     canvas.width = 400;
     canvas.height = 200;
     canvas.id = 'dummyCanvas';
     canvas.style.display = 'none';
     document.body.appendChild(canvas);

     // create instance of Martin from image
     canvas = Martin('dummyCanvas');
     canvas.canvas.style.display = 'none';

     var baseLayer = canvas.layers[0];

     it('sets key canvas: HTML node canvas', function() {
         expect(canvas.canvas.tagName).toBe('CANVAS');
     });

     it('sets a canvas width', function() {
         expect(canvas.canvas.width).toBeGreaterThan(0);
     });

     it('sets a canvas height', function() {
         expect(canvas.canvas.height).toBeGreaterThan(0);
     });

     it('sets key context: CanvasRenderingContext2D', function() {
         expect(canvas.context instanceof CanvasRenderingContext2D).toBe(true);
     });

     it('sets a base layer', function() {
         expect(canvas.layers.length).toBe(1);
     });

     it('..with its own key canvas: HTML node canvas', function() {
         expect(baseLayer.canvas.tagName).toBe('CANVAS');
     });

     it('..with its own key context: CanvasRenderingContext2D', function() {
         expect(baseLayer.context instanceof CanvasRenderingContext2D).toBe(true);
     });

 });
