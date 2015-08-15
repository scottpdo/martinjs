/*
    For helper functions that don't extend Martin prototype.

    degToRad()
    radToDeg()
    hexToRGB()
*/

Martin.degToRad = function(deg) {
    return deg * ( Math.PI / 180 );
};

Martin.radToDeg = function(rad) {
    return rad * ( 180 / Math.PI );
};

Martin.hexToRGB = function( hex ) {

    if ( !hex ) { return false; }

    if ( hex.slice(0, 1) === '#' ) { hex = hex.slice(1); }

    var r, g, b;

    if ( hex.length === 6 ) {

        r = hex.slice(0, 2);
        g = hex.slice(2, 4);
        b = hex.slice(4, 6);

    } else if ( hex.length === 3 ) {

        r = hex.slice(0, 1) + hex.slice(0, 1);
        g = hex.slice(1, 2) + hex.slice(1, 2);
        b = hex.slice(2, 3) + hex.slice(2, 3);

    }

    return {
        r: parseInt(r, 16),
        g: parseInt(g, 16),
        b: parseInt(b, 16)
    };

};
