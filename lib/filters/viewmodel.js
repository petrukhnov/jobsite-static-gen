'use strict';

var _ = require('underscore'),
    prismic = require('./prismic_utils'),
    prismicRst = require('./prismic_rst_utils'),
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

function getFormattedDate(date) {
    return swig.render("{{ dateValue | date('F Y') }}", {
        locals: { dateValue: date}
    });
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
            date: getFormattedDate(prismic.getValue(input, 'date')),
            authors: authors,
            authorNames: authors.map(getFullName),
            content: getFormattedContent()
        };

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

    getRstBlogpost: function(input, authorsViewmodel) {

        return _.extend({
            id: prismic.getId(input)
        }, parseRstBlogpost(input));

        function parseRstBlogpost(input) {
            var metaData = prismicRst.getMetaData(input);
            var rstBody  = prismicRst.getRstBody(input);
            var authors = _.filter(authorsViewmodel, function(a) {
                return _.contains(metaData.authorNames, a.fullName);
            });
            return {
                slug: metaData.slug,
                title: metaData.title,
                description: metaData.description,
                image: metaData.image,
                date: getFormattedDate(metaData.date),
                authors: authors,
                authorNames: metaData.authorNames,
                content: rstBody
            };
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
        var id = greenhouse.get(input, 'id');
        var categories = greenhouse.getMetadata(input, 'category');
        var firstCategory = categories[0] || '';

        return {
            id: id,
            link: 'jobs/' + id + '/?gh_jid=' + id,
            title: greenhouse.get(input, 'title'),
            content: escapist.unicode.unescape(greenhouse.get(input, 'content')),
            department: greenhouse.getAttributeName(input, 'department'),
            image: greenhouse.getMetadata(input, 'image-url'),
            categories: categories,
            firstCategory: firstCategory,
            firstCategoryId: JOB_CATEGORY_IDS[firstCategory] || 'other',
            locations: greenhouse.getAttributeName(input, 'location'),
            updated: greenhouse.get(input, 'updated_at')
        };
    }

}
