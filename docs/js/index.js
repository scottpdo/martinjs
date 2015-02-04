$(document).ready(function(){

function init(canvas) {

    canvas.rect({
        offsetX: 130,
        offsetY: 20,
        width: 90,
        height: 50,
        color: '#fff'
    });

    canvas.write({
        text: 'Hi Martin',
        offsetX: 145,
        offsetY: 35
    });

    canvas.toBW().convertToImage();

}

if ( document.getElementById('image') ) new Martin('image', init);

});
