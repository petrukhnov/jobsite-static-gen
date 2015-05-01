'use strict';

module.exports = {

    getId: function(input) {
        if (input &&
            input.id) {

            return input.id;
        } else {
            return 'UNDEFINED_ID'
        }
    },

    getSlug: function(input) {
        if (input &&
            input.slug) {

            return input.slug;
        } else {
            return 'UNDEFINED_SLUG'
        }
    },

    getValue: function(input, attribute, fallback) {
        if (input &&
            input.data &&
            input.data[attribute] &&
            input.data[attribute].json &&
            input.data[attribute].json.value) {

            return input.data[attribute].json.value;
        } else {
            return fallback || '';
        }
    },

    getBlockText: function(input, attribute, fallback) {
        if (input &&
            input.data &&
            input.data[attribute] &&
            input.data[attribute].json &&
            input.data[attribute].json.blocks &&
            input.data[attribute].json.blocks[0] &&
            input.data[attribute].json.blocks[0].text) {

            return input.data[attribute].json.blocks[0].text;
        } else {
            return fallback || '';
        }
    },

    getMainImage: function(input, attribute, fallback) {
        if (input &&
            input.data &&
            input.data[attribute] &&
            input.data[attribute].json &&
            input.data[attribute].json.main &&
            input.data[attribute].json.main.url) {

            return input.data[attribute].json.main.url;
        } else {
            return fallback || '';
        }
    },

    getDocumentId: function(input, fallback) {
        if (input &&
            input.fragments &&
            input.fragments.link &&
            input.fragments.link.value &&
            input.fragments.link.value.document &&
            input.fragments.link.value.document.id) {

            return input.fragments.link.value.document.id
        } else {
            return fallback || '';
        }
    }

};