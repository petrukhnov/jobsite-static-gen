'use strict';

var _ = require('underscore'),
    fs = require('fs-extra'),
    utils = require('./utils');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to retrieve content from Greenhouse.io and place in the file's metadata.
 *
 * @param {Object} options
 *   @property {String} urlPrefix URL prefix for images, for determining file name without path
 * @return {Function}
 */

function plugin(options) {
    var options = options || {},
        outputPath = options.outputPath || '.',
        filename = options.filename || 'indexableJobs.json';

    return function(files, metalsmith, done) {
        var metadata = metalsmith.metadata(),
            lunrIndex,
            jobs,
            indexJson = '';

        // get indexable jobs data
        jobs = metadata.greenhouse.jobs.map(utils.mapGreenhouseJob);

        fs.ensureDirSync(outputPath);
        fs.writeFile(outputPath + '/' + filename, JSON.stringify(jobs), function (err) {
            if (err) throw err;
            done();
        });
    }
}
