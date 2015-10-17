/*
    Martin.js: In-browser photo and image editing
    Author: Scott Donaldson
    Contact: scott.p.donaldson@gmail.com
    Twitter: @scottpdonaldson

    ----------------------------------------

    MARTIN
*/

// The great initializer. Pass in a string to select element by ID,
// or an HTMLElement
var Martin = function( val, options ) {

    if ( !(this instanceof Martin) ) return new Martin( val, options );

    // Set the original element, if there is one
    this.original = null;
    if ( typeof val === 'string' ) {
        this.original = document.getElementById(val);
    } else if ( val instanceof HTMLElement ) {
        this.original = val;
    }

    this.options = options || {};

    // Now prepare yourself...
    return this.makeCanvas();
};

Martin.prototype.makeCanvas = require('./core/init.js');

var utils = {};

// var utils = require('./core/utils.js');

for ( var types in utils ) {
    for ( var func in utils[types] ) {
        if ( type === '_private' ) {
            Martin.utils[func] = utils[types][func];
        } else {
            Martin.prototype[func] = utils[types][func];
        }
    }
}

if ( typeof window === 'object' ) {
    window.Martin = Martin;
}

module.exports = Martin;