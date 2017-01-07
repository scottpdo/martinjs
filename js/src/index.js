/*
    Martin.js
    Author: Scott Donaldson
    Contact: scott.p.donaldson@gmail.com
    Twitter: @scottpdonaldson
*/

// The great initializer. Pass in a string to select element by ID,
// or an HTMLElement
function Martin( val, options ) {

    var original = null;

    if ( typeof val === 'string' ) {
        original = document.getElementById(val);
    } else if ( val instanceof HTMLElement ) {
        original = val;
    }

    var output = require('./core.js')(original, options);
    output.init();
    return output;
}

if ( typeof window === 'object' ) {
    window.Martin = Martin;
}

module.exports = Martin;