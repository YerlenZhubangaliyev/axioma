'use strict';

var
    quote = require('./modules/quote')
;

/**
 * @module main
 */
var main = function () {
    this
        .initialize()
    ;
};

/**
 * 
 * @returns {main}
 */
main.prototype.initialize = function () {
    (new quote());

    return this;
};

(new main());
