'use strict';

var _ = require('underscore');

module.exports = {

    getMetaData: function(input, metaTextToObject, fallback) {
        if (input &&
            input.data &&
            input.data.body &&
            input.data.body.json &&
            input.data.body.json.blocks[0] &&
            input.data.body.json.blocks[0].text) {

            var metaDataText = input.data.body.json.blocks[0].text;
            var metaData     = metaTextToObject(metaDataText);

            return metaData;

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

    getBodyAsText: function(input, getBodyBlocks, fallback) {
        if (input &&
            input.data &&
            input.data.body &&
            input.data.body.json &&
            input.data.body.json.blocks) {

            return convertToText(getBodyBlocks(input.data.body.json.blocks));

        } else {
            return fallback || '';
        }
    }
};

function convertToText(blocks) {
    return _.pluck(blocks, 'text');
}
