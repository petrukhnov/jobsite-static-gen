'use strict';

var _ = require('underscore'),
    prismic = require('./prismic_utils'),
    swig = require('swig'),
    to_authors_viewmodel = require('./to_authors_viewmodel');

/**
 * Transform input blogposts model to a blogposts view model.
 *
 * @example
 * {% set blogposts_viewmodel =
 *     prismic.blogposts|to_blogposts_viewmodel(prismic.authors) %}
 *
 * @param  {*}      input raw blogposts data
 * @param  {object} authors Raw authors model.
 * @return {*}
 */
module.exports = function (input, authors) {
    if (!input || !input.results) { return []; }

    var blogposts_viewmodel = [];

    _.each(input.results, function(blogpost_input) {
        blogposts_viewmodel.push(to_blogpost_viewmodel(blogpost_input, authors));
    });

    return blogposts_viewmodel;
}

function to_blogpost_viewmodel(input, authors) {
    var viewmodel = {},
        authorsViewmodel = to_authors_viewmodel(authors);

    viewmodel.id = prismic.getId(input);
    viewmodel.slug = prismic.getSlug(input);
    viewmodel.title = prismic.getBlockText(input, 'title');
    viewmodel.description = prismic.getBlockText(input, 'shortlede');
    viewmodel.image = prismic.getMainImage(input, 'image');
    viewmodel.date = swig.render("{{ dateValue | date('F Y') }}", {
        locals: { dateValue: prismic.getValue(input, 'date') }
    });
    // determine author names
    var authorIds = _.map(prismic.getValue(input, 'authors', []), function(a) {
        return prismic.getDocumentId(a);
    });
    var filteredAuthorsViewmodels = _.filter(authorsViewmodel, function(a) {
        return _.contains(authorIds, a.id);
    });
    viewmodel.authors = _.map(filteredAuthorsViewmodels, function(a) {
        return a.fullName;
    });

    return viewmodel;
}
