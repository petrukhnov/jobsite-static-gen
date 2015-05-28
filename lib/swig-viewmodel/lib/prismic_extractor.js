'use strict';

var _ = require('underscore');

module.exports = {

    getMetaData: function(input, fallback) {
        if (input &&
            input.data &&
            input.data.body &&
            input.data.body.json &&
            input.data.body.json.blocks[0] &&
            input.data.body.json.blocks[0].text) {

            return metaTextToObject(input.data.body.json.blocks[0].text);

        } else {
            return fallback || {};
        }
    },

    getMetaDataTags: function(input, fallback) {
        if (input &&
            input.tags) {

            return input.tags.split(',').map(function(t) { return t.trim(); });
        } else {
            return fallback || [];
        }
    },

    getBodyAsHtml: function(input, markup2html, fallback) {
        if (input &&
            input.data &&
            input.data.body &&
            input.data.body.json &&
            input.data.body.json.blocks) {

            var textBlocks = getTextBlocks(input.data.body.json.blocks);
            var markup = convertToText(withoutMetadata(textBlocks));

            // replace '/images/' with '../images/' for URLs in image blocks
            markup = sanitizeImageURLs(markup);

            // prepare the formulas for MathJax
            markup = prepareMath(markup);

            return markup2html(markup);

        } else {
            return fallback || '';
        }
    }
};

function getTextBlocks(blocks) {
    return _.pluck(blocks, 'text');
}

function convertToText(blocks) {
    return blocks.join('\n\n');
}

function sanitizeImageURLs(markup) {
    // search for image URLs that start with '/images/' and replace it with '../images/'
    var regex = /^(\s*)\.\.\simage::\s\/images\/(.*)$/gm;
    return markup.replace(regex, '$1.. image:: ../images/$2');
}

function prepareMath(markup) {
    // <div class="math"> \begin{equation*}
    var regex = /^(\s*)\.\.\smath::\s(.*)/gm,
        mathPrefix = '<div class="math"> \\begin{equation*} ',
        mathPostfix = ' \\end{equation*} </div>';
    return markup.replace(regex, '$1.. raw:: html\n\n$1  ' + mathPrefix + '$2' + mathPostfix);
}

function withoutMetadata(blocks) {
    // First block is always metadata. Also drop teaser markers.
    return _.reject(blocks.slice(1), isTeaserMarker);
}

function isTeaserMarker(block) {
    return block.indexOf('TEASER_END') >= 0;
}

function metaTextToObject(metadataText) {
    // capture key-value pairs, separated with colons, from metadata text
    var regex = /^\.\.\s(.+?):.(.*)$/gm;
    var result = {};
    result.authorNames = [];
    var match;
    while ((match = regex.exec(metadataText)) !== null) {
        var key = match[1];
        var value = match[2]
        result[key] = value;
        if (key.match(/^.*author$/) !== null) {
            result.authorNames.push(value);
        }
    }

    return result;
}
