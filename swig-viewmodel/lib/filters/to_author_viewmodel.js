'use strict';

var _ = require('underscore'),
    viewmodel = require('./viewmodel');

/**
 * Transform input authors model to a author view model.
 *
 * @example
 * {% set author_viewmodel =
 *     prismic.authors|to_author_viewmodel %}
 *
 * @param  {*}      input raw authors data
 * @param  {object} options to configure the transformation
 * @return {*}
 */
module.exports = function (input, options) {
    if (!input || !input.results) { return {}; }

    var res = {},
        author;
    if (options.fullName) {
        _.each(input.results, function(a) {
            author = viewmodel.getAuthor(a);
            if (author.fullName === options.fullName) {
                res = author;
            }
        });
    }

    return res;
}
