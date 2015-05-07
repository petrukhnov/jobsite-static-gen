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
    if (!input || !input.results || !input.results[0]) { return {}; }

    return viewmodel.getAuthor(input.results[0]);
}
