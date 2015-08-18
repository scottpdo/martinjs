/*
    Martin.js: In-browser photo and image editing
    Author: Scott Donaldson
    Contact: scott.p.donaldson@gmail.com
    Twitter: @scottpdonaldson

    ----------------------------------------

    MARTIN
*/

(function() {

// The great initializer. Pass in a string to select element by ID,
// or an HTMLElement
function Martin( val, options ) {

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

Martin.utils = {};
