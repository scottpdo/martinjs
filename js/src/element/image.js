function drawImage(img) {
    this.context.drawImage( img, 0, 0 );
}

registerElement('image', function(img) {
    drawImage.call(this, img);
});
