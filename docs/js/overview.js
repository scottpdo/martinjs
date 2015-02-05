$(document).ready(function(){

function init(canvas) {

    canvas.rect({
        offsetX: 150,
        offsetY: 25,
        width: 200,
        height: 250,
        color: '#33e' // blue
    });

}

if ( document.getElementById('martin-overview') ) new Martin('martin-overview', init);

});
