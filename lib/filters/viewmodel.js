'use strict';

var _ = require('underscore'),
    prismic = require('./prismic_utils'),
    greenhouse = require('./greenhouse_utils'),
    swig = require('swig'),
    escapist = require('node-escapist');

var JOB_CATEGORY_IDS = {
        'Engineering & Development': 'tech',
        'Product & UX': 'procuct',
        'Data Science': 'data',
        'Other': 'other',
        'Hidden': 'hidden'
    }

module.exports = {

    getBlogpost: function(input, authorsViewmodel) {
        var authors = _.filter(authorsViewmodel, containsAuthorId());

        return {
            id: prismic.getId(input),
            slug: prismic.getSlug(input),
            title: prismic.getBlockText(input, 'title'),
            description: prismic.getBlockText(input, 'shortlede'),
            image: prismic.getMainImage(input, 'image'),
            date: getFormattedDate(),
            authors: authors,
            authorNames: authors.map(getFullName),
            content: getFormattedContent()
        };

        function getFormattedDate() {
            return swig.render("{{ dateValue | date('F Y') }}", {
                locals: { dateValue: prismic.getValue(input, 'date') }
            })
        }
        function getFullName(author) {
            return author.fullName;
        }
        function containsAuthorId() {
            var authorIds = prismic.getValue(input, 'authors', []).map(function(a) {
                return prismic.getDocumentId(a);
            });

            return function(a) {
                return _.contains(authorIds, a.id);
            };
        }
        function getFormattedContent() {
            return prismic.getHtml(input, 'body')
                .replace(/``([^`]*)``/g, '<code>$1</code>')
                .replace(/<p>\.\. code:: (.*?)<\/p><p>(.*?)<\/p>/g, '<pre><code data-lang="$1">$2</code></pre>');
        }
    },

    getAuthor: function(input) {
        var viewmodel = {};

        viewmodel.id = prismic.getId(input);
        viewmodel.slug = prismic.getSlug(input);
        viewmodel.fullName = prismic.getBlockText(input, 'full_name');
        viewmodel.title = prismic.getValue(input, 'title');
        viewmodel.company = prismic.getValue(input, 'company');
        viewmodel.image = prismic.getMainImage(input, 'image');
        viewmodel.nationality = prismic.getValue(input, 'nationality');
        viewmodel.quote = prismic.getBlockText(input, 'quote');
        viewmodel.personalTips = prismic.getHtml(input, 'personal_tips');

        return viewmodel;
    },

    getDoc: function(input) {
        var viewmodel = {};

        viewmodel.slug = prismic.getSlug(input);
        viewmodel.title = prismic.getBlockText(input, 'title');
        viewmodel.content = prismic.getHtml(input, 'content');

        return viewmodel;
    },

    getJob: function(input) {
        var viewmodel = {};

        viewmodel.id = greenhouse.get(input, 'id');
        viewmodel.link = 'jobs/' + viewmodel.id + '/?gh_jid=' + viewmodel.id;
        viewmodel.title = greenhouse.get(input, 'title');
        viewmodel.content = escapist.unicode.unescape(greenhouse.get(input, 'content'));
        viewmodel.department = greenhouse.getAttributeName(input, 'department');
        viewmodel.image = greenhouse.getMetadata(input, 'image-url');
        viewmodel.categories = greenhouse.getMetadata(input, 'category');
        viewmodel.firstCategory = viewmodel.categories[0] || '';
        viewmodel.firstCategoryId = JOB_CATEGORY_IDS[viewmodel.firstCategory] || 'other';
        viewmodel.locations = greenhouse.getAttributeName(input, 'location');
        viewmodel.updated = greenhouse.get(input, 'updated_at');

        return viewmodel;
    }

}
