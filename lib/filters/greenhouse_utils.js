'use strict';

var _ = require('underscore');

module.exports = {

    get: function(input, attribute, fallback) {
        if (input &&
            input[attribute]) {

            return input[attribute];
        } else {
            return fallback || '';
        }
    },

    getDepartment: function(input, fallback) {
        if (input &&
            input.department &&
            input.department.name) {

            return input.department.name;
        } else {
            return fallback || '';
        }
    },

    getOffices: function(input, fallback) {
        if (input &&
            input.offices) {

            return _.pluck(input.offices, 'name');
        } else {
            return fallback || '';
        }
    },
    
    getMetadata: function(input, attribute, fallback) {
        if (input.metadata) {

            var metadata = fallback || '';
            _.each(input.metadata, function(m) {
                if (m.name === attribute) {
                    metadata = m.value;
                }
            })

            return metadata;
        } else {
            return fallback || '';
        }
    }

};