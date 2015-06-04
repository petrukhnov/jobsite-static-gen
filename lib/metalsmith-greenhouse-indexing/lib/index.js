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
        filename = options.filename || 'lunrJobsIndex.json';

    return function(files, metalsmith, done) {
        var metadata = metalsmith.metadata(),
            lunrIndex,
            jobs,
            indexJson = '';

        // build lunr.js index for greenhouse jobs
        lunrIndex = utils.initialLunrJobsIndex();
        jobs = metadata.greenhouse.jobs.map(utils.mapGreenhouseJob);
        _.each(jobs, function(job) {
            lunrIndex.add(job);
        });

        metadata.indexing = metadata.indexing || {};
        metadata.indexing.greenhouse_jobs = {
            'engine': 'lunr.js',
            'json': JSON.stringify(lunrIndex.toJSON())
        }

        fs.ensureDirSync(outputPath);
        fs.writeFile(outputPath + '/' + filename, JSON.stringify(lunrIndex.toJSON()), function (err) {
            if (err) throw err;
            done();
        });
    }
}
