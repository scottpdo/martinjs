$(document).ready(function(){

function init(canvas) {
    canvas.watermark('Photo credit: Scottland Donaldson');
}

if ( document.getElementById('watermark')) new Martin('watermark', init);

});
