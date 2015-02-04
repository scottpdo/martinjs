$(document).ready(function(){

function init(canvas) {

    canvas.rect({
        offsetX: 25,
        offsetY: 25,
        width: 90,
        height: 50,
        color: '#33e'
    });

}

if ( document.getElementById('martin-overview') ) new Martin('martin-overview', init);

});
