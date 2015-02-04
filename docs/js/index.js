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
        offsetY: 50
    });

    canvas.toBW().convertToImage();

}

new Martin('image', init);
