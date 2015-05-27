'use strict';

var _ = require('underscore'),
    prismic = require('./prismic_utils'),
    prismicRst = require('./prismic_rst_utils'),
    greenhouse = require('./greenhouse_utils'),
    swig = require('swig'),
    rst2html = require('../rst2html'),
    escapist = require('node-escapist');

var JOB_CATEGORY_IDS = {
        'Engineering & Development': 'tech',
        'Product & UX': 'procuct',
        'Data Science': 'data',
        'Other': 'other',
        'Hidden': 'hidden'
    };

module.exports = {

    getBlogpost: function(input, authorsViewmodel, options) {
        options = options || {};
        var authors = authorsViewmodel.filter(containsAuthorIdFrom(input));
        var inputDate = prismic.getValue(input, 'date');
        var tags = prismic.get(input, 'tags', []);

        return {
            id: prismic.getId(input),
            slug: prismic.getSlug(input),
            title: prismic.getBlockText(input, 'title'),
            description: prismic.getBlockText(input, 'shortlede'),
            image: prismic.getMainImage(input, 'image'),
            thumbnail: prismic.getMainImage(input, 'image'),
            date: getFormattedDate(inputDate),
            rawDate: Date.parse(inputDate),
            authors: authors,
            authorNames: authors.map(getFullName),
            content: getContent(),
            tags: tags
        };

        function getContent() {
            if (options.ignoreContent && options.ignoreContent === true) {
                return '';
            } else {
                return prismic.getHtml(input, 'body')
                    .replace(/``([^`]*)``/g, '<code>$1</code>')
                    .replace(/<p>\.\. code:: (.*?)<\/p><p>(.*?)<\/p>/g, '<pre><code data-lang="$1">$2</code></pre>');
            }
        }
    },

    getRstBlogpost: function(input, authorsViewmodel, options) {
        options = options || {};
        var metaData = prismicRst.getMetaData(input);
        var rstBody  = prismicRst.getRstBody(input);
        var authors = authorsViewmodel.filter(metadataContainsFullName);
        var inputDate = metaData.date;
        var tags = prismicRst.getMetaDataTags(metaData, []);

        return {
            id: prismic.getId(input),
            slug: metaData.slug,
            title: metaData.title,
            description: metaData.description,
            image: '../images/' + metaData.image,
            thumbnail: 'images/' + metaData.image,
            date: getFormattedDate(inputDate),
            rawDate: Date.parse(inputDate),
            authors: authors,
            authorNames: metaData.authorNames,
            content: getContent(),
            tags: tags
        };

        function metadataContainsFullName(author) {
            return _.contains(metaData.authorNames, author.fullName);
        }

        function getContent() {
            if (options.ignoreContent && options.ignoreContent === true) {
                return '';
            } else {
                return rst2html(rstBody);
            }
        }
    },

    getAuthor: function(input) {
        return {
            id: prismic.getId(input),
            slug: prismic.getSlug(input),
            fullName: prismic.getBlockText(input, 'full_name'),
            title: prismic.getValue(input, 'title'),
            company: prismic.getValue(input, 'company'),
            thumbnail: prismic.getMainImage(input, 'image'),
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
            thumbnail: greenhouse.getMetadata(input, 'image-url'),
            categories: categories,
            firstCategory: firstCategory,
            firstCategoryId: JOB_CATEGORY_IDS[firstCategory] || 'other',
            locations: greenhouse.getAttributeName(input, 'location'),
            updated: greenhouse.get(input, 'updated_at')
        };
    }

}

function getFormattedDate(date) {
    return swig.render("{{ dateValue | date('j M Y') }}", {
        locals: { dateValue: date}
    });
}
function getFullName(author) {
    return author.fullName;
}
function containsAuthorIdFrom(blogposts) {
    var authorIds = prismic.getValue(blogposts, 'authors', []).map(function(a) {
        return prismic.getDocumentId(a);
    });

    return function(a) {
        return _.contains(authorIds, a.id);
    };
}