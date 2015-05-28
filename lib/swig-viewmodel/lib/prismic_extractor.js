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
            return markup2html(convertToText(withoutMetadata(textBlocks)));

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
        result[match[1]] = match[2];
        if (match[1].match(/^.*?_author$/) !== null) {
            result.authorNames.push(match[2]);
        }
    }

    return result;
}
