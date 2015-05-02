'use strict';

var _ = require('underscore'),
    viewmodel = require('./viewmodel'),
    to_authors_viewmodel = require('./to_authors_viewmodel');

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
module.exports = function (input, options) {
    if (!input) { return []; }

    var options = options || {},
        jobs_viewmodel = [];

    if (options.limit !== undefined) {
        input = _.first(input, options.limit);
    }

    // console.log(options);
    // console.log(input);

    _.each(input, function(job_input) {
        jobs_viewmodel.push(viewmodel.getJob(job_input));
    });

    return jobs_viewmodel;
}
