'use strict';

var _ = require('underscore'),
    viewmodel = require('./viewmodel');

/**
 * Transform input docs model to a doc view model.
 *
 * @example
 * {% set job_viewmodel =
 *     greenhouse.jobs|to_job_viewmodel %}
 *
 * @param  {*}      input raw job data
 * @return {*}
 */
module.exports = function (input) {
    if (!input || !input[0]) { return {}; }

    return viewmodel.getJob(input[0]);
}