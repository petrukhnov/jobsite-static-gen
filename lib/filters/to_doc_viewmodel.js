'use strict';

var _ = require('underscore'),
    viewmodel = require('./viewmodel');

/**
 * Transform input blogposts model to a blogposts view model.
 *
 * @example
 * {% set blogposts_viewmodel =
 *     prismic.blogposts|to_blogposts_viewmodel(prismic.authors) %}
 *
 * @param  {*}      input raw blogposts data
 * @param  {object} authors Raw authors model.
 * @return {*}
 */
module.exports = function (input) {
    if (!input || !input.results || !input.results[0]) { return {}; }

    return viewmodel.getDoc(input.results[0]);
}
