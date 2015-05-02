'use strict';

var _ = require('underscore'),
    prismic = require('./prismic_utils'),
    swig = require('swig');

module.exports = {

    getBlogpost: function(input, authorsViewmodel) {
        var viewmodel = {};

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
        viewmodel.content = prismic.getHtml(input, 'body')
            .replace(/``([^`]*)``/g, '<code>$1</code>')
            .replace(/<p>\.\. code:: (.*?)<\/p><p>(.*?)<\/p>/g, '<pre><code data-lang="$1">$2</code></pre>');

        return viewmodel;
    },

    getAuthor: function(input) {
        var viewmodel = {};

        viewmodel.id = prismic.getId(input);
        viewmodel.slug = prismic.getSlug(input);
        viewmodel.fullName = prismic.getBlockText(input, 'full_name');
        viewmodel.title = prismic.getValue(input, 'title');
        viewmodel.company = prismic.getValue(input, 'company');
        viewmodel.image = prismic.getMainImage(input, 'image');

        return viewmodel;
    },

    getDoc: function(input) {
        var viewmodel = {};

        viewmodel.slug = prismic.getSlug(input);
        viewmodel.title = prismic.getBlockText(input, 'title');
        viewmodel.content = prismic.getHtml(input, 'content');

        return viewmodel;
    }

}