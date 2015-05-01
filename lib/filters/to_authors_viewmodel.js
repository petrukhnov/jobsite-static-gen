'use strict';

var _ = require('underscore'),
    prismic = require('./prismic_utils');

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
        authors_viewmodel.push(to_author_viewmodel(author_input));
    });

    return authors_viewmodel;
}

function to_author_viewmodel(input) {
    var viewmodel = {};

    viewmodel.id = prismic.getId(input);
    viewmodel.slug = prismic.getSlug(input);
    viewmodel.fullName = prismic.getBlockText(input, 'full_name');
    viewmodel.title = prismic.getValue(input, 'title');
    viewmodel.company = prismic.getValue(input, 'company');
    viewmodel.image = prismic.getMainImage(input, 'image');

    return viewmodel;
}