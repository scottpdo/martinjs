function init(canvas) {

    canvas.rect({
        offsetX: 130,
        offsetY: 20,
        width: 100,
        height: 100,
        color: '#000'
    });

    canvas.toBW().convertToImage();

}

new Martin('image', init);
