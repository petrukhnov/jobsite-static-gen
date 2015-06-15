'use strict';

var _ = require('underscore'),
    prismic = require('./prismic_utils'),
    prismicExtractor = require('../prismic_extractor'),
    ioExecutorSync = require('../ioExecutorSync'),
    greenhouse = require('./greenhouse_utils'),
    swig = require('swig'),
    escapist = require('node-escapist');

var rst2html = ioExecutorSync('rst2html', ['--template=rst2html-template.txt']),
    md2html = ioExecutorSync('markdown_py', []);

var JOB_CATEGORY_IDS = {
        'Engineering & Development': 'tech',
        'Product & UX': 'product',
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

        function prepareMath(markup) {
            var regex = /\.\. math::(.+?)(?=<|\.\. math::)/g,
                mathPrefix = '<div class="math"> \\begin{equation*} ',
                mathPostfix = ' \\end{equation*} </div>';
            return markup.replace(regex, mathPrefix + '$1' + mathPostfix);
        }

        function getContent() {
            if (options.ignoreContent && options.ignoreContent === true) {
                return '';
            } else {
                var markup = prismic.getHtml(input, 'body')
                    .replace(/``([^`]*)``/g, '<code>$1</code>')
                    .replace(/<p>\.\. code:: (.*?)<\/p><p>(.*?)<\/p>/g, '<pre><code data-lang="$1">$2</code></pre>');
                return prepareMath(markup);
            }
        }
    },

    getRstBlogpost: function(input, authorsViewmodel, options) {
        return getOldStyleBlogpost(input, authorsViewmodel, rst2html, options);
    },

    getMdBlogpost: function(input, authorsViewmodel, options) {
        return getOldStyleBlogpost(input, authorsViewmodel, md2html, options);
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
            thumbnail: 'images/560x354/' + greenhouse.getImageUrlFileName(input),
            categories: categories,
            firstCategory: firstCategory,
            firstCategoryId: JOB_CATEGORY_IDS[firstCategory] || 'other',
            locations: greenhouse.getAttributeName(input, 'location'),
            updated: greenhouse.get(input, 'updated_at')
        };
    }

}

function getOldStyleBlogpost(input, authorsViewmodel, markup2html, options) {
    options = options || {};
    var metaData = prismicExtractor.getMetaData(input);
    var authors = authorsViewmodel.filter(metadataContainsFullName);
    var inputDate = metaData.date;

    return {
        id: prismic.getId(input),
        slug: prismic.getSlug(input),
        title: metaData.title,
        description: prismic.getBlockText(input, 'shortlede'),
        image: '../images/' + metaData.image,
        thumbnail: 'images/' + metaData.image,
        date: getFormattedDate(inputDate),
        rawDate: Date.parse(inputDate),
        authors: authors,
        authorNames: metaData.authorNames,
        content: getContent(),
        tags: prismicExtractor.getMetaDataTags(metaData, [])
    };

    function metadataContainsFullName(author) {
        return _.contains(metaData.authorNames, author.fullName);
    }
    function getContent() {
        return options.ignoreContent ? '' : prismicExtractor.getBodyAsHtml(input, markup2html);
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
