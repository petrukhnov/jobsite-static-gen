'use strict';

/**
 * Decides wether to use singular or plural form for a given number
 */
module.exports = function (input, singular, plural) {
    return input === 1 ? input + ' ' + singular : input + ' ' + plural;
}
