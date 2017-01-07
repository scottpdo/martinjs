(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(original, options) {
	return {
		init: function() {
			if (original) {
				var canvas = document.createElement('canvas'),
					context = canvas.getContext('2d');
				context.drawImage(original, 0, 0);
				original.parentNode.appendChild(canvas);
			}
		},
		render: function() {
			// window.requestAnimationFrame(this.render);
		}
	};
};
},{}],2:[function(require,module,exports){
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
},{"./core.js":1}]},{},[2]);
