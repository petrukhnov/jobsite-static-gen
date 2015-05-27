'use strict';

var _ = require('underscore');

function rstToObject(rst) {
    // capture key-value pairs, separated with colons, from rst lines
    var regex = /^\.\.\s(.+?):.(.*)$/gm;
    var result = {};
    result.authorNames = [];
    var match;
    while ((match = regex.exec(rst)) !== null) {
        result[match[1]] = match[2];
        if (match[1].match(/^.*?author$/) !== null) {
            result.authorNames.push(match[2]);
        }
    }

    return result;
}

function extractTexts(blocks) {
    return _.pluck(blocks, 'text');
}

function sanitizeImages(rst) {
    var regex = /^(\s*)\.\.\simage::\s\/images\/(.*)$/gm;
    return rst.replace(regex, '$1.. image:: ../images/$2');
}

module.exports = {

    getMetaData: function(input, attribute, fallback) {
        if (input &&
            input.data &&
            input.data.body &&
            input.data.body.json &&
            input.data.body.json.blocks[0] &&
            input.data.body.json.blocks[0].text) {

            var metaDataRst = input.data.body.json.blocks[0].text;
            var metaData    = rstToObject(metaDataRst);

            return metaData;

        } else {
            return fallback || '';
        }
    },

    getRstBody: function(input, fallback) {
        if (input &&
            input.data &&
            input.data.body &&
            input.data.body.json &&
            input.data.body.json.blocks) {

            // first three blocks are metadata, thus they are skipped
            var bodyBlocks = input.data.body.json.blocks.slice(3);
            var rst        = extractTexts(bodyBlocks).join('\n\n');

            return sanitizeImages(rst);

        } else {
            return fallback || '';
        }
    },

    getMetaDataTags: function(input, fallback) {
        if (input &&
            input.tags) {

            return input.tags.split(',').map(function(t) { return t.trim(); });
        } else {
            return fallback || '';
        }
    }
};
