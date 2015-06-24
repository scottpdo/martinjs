$(document).ready(function(){

(function() {
    var canvas = Martin('demo-sepia');
    canvas.darken(10);
    canvas.desaturate(100);

    canvas.newLayer();
    canvas.background('#ea0');
    canvas.opacity(40);
    canvas.rect({
        width: '100%',
        height: '15%'
    });

    canvas.newLayer();
    canvas.text({
        text: 'The loneliest bunny in the west.',
        x: '50%',
        y: 13,
        align: 'center',
        color: '#fff'
    });

})();

(function() {
    var canvas = Martin('demo-checkerboard');
    var w = canvas.width(),
        h = canvas.height(),
        iter = 0;

    var size = 40,
        x = w / size, // tiles in x direction
        y = h / size; // tiles in y direction

    for ( var i = 0; i < x; i++ ) {

        if ( y % 2 !== 1 ) iter++;

        for ( var j = 0; j < y; j++ ) {

            if ( iter % 2 === 0 ) {

                canvas.rect({
                    x: i * size,
                    y: j * size,
                    height: size,
                    width: size
                });
            }
            iter++;
        }
    }

})();

});
