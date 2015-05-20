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
    };

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
        return {
            id: prismic.getId(input),
            slug: prismic.getSlug(input),
            fullName: prismic.getBlockText(input, 'full_name'),
            title: prismic.getValue(input, 'title'),
            company: prismic.getValue(input, 'company'),
            image: prismic.getMainImage(input, 'image'),
            nationality: prismic.getValue(input, 'nationality'),
            quote: prismic.getBlockText(input, 'quote'),
            personalTips: prismic.getHtml(input, 'personal_tips')
        };
    },

    getDoc: function(input) {
        return {
            slug: prismic.getSlug(input),
            title: prismic.getBlockText(input, 'title'),
            content: prismic.getHtml(input, 'content')
        };
    },

    getJob: function(input) {
        return {
            id: greenhouse.get(input, 'id'),
            link: 'jobs/' + id + '/?gh_jid=' + id,
            title: greenhouse.get(input, 'title'),
            content: escapist.unicode.unescape(greenhouse.get(input, 'content')),
            department: greenhouse.getAttributeName(input, 'department'),
            image: greenhouse.getMetadata(input, 'image-url'),
            categories: greenhouse.getMetadata(input, 'category'),
            firstCategory: categories[0] || '',
            firstCategoryId: JOB_CATEGORY_IDS[firstCategory] || 'other',
            locations: greenhouse.getAttributeName(input, 'location'),
            updated: greenhouse.get(input, 'updated_at')
        };
    }

}
