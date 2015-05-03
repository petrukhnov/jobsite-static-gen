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

    for (var i=0; i<10; i++) {
        _.each(input, function(job_input) {
            jobs_viewmodel.push(viewmodel.getJob(job_input));
        });
    }

    if (options.category !== undefined) {
        jobs_viewmodel = _.filter(jobs_viewmodel, function(j) {
            return _.contains(j.categories, options.category);
        });
    }
    if (options.limit !== undefined) {
        jobs_viewmodel = _.first(jobs_viewmodel, options.limit);
    }

    return jobs_viewmodel;
}
