'use strict';

var _ = require('underscore'),
    viewmodel = require('./viewmodel');

/**
 * Transform input authors model to a authors view model.
 *
 * @example
 * {% set authors_viewmodel =
 *     prismic.authors|to_authors_viewmodel %}
 *
 * @param  {*}      input raw authors data
 * @return {*}
 */
module.exports = function (input) {
    if (!input || !input.results) { return []; }

    var authors_viewmodel = [];

    _.each(input.results, function(author_input) {
        authors_viewmodel.push(viewmodel.getAuthor(author_input));
    });

    return authors_viewmodel;
}
