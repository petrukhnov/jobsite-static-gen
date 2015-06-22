var assert = require('assert'),
    metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    partial = require('metalsmith-partial'),
    templates = require('metalsmith-templates');

var swig = require('swig'),
    viewmodel = require('../lib/swig-viewmodel');

viewmodel.useFilter(swig, 'to_job_viewmodel');

describe('job-ad', function() {
    it('should produce job page HTML', function(testDone) {
        metalsmith('test')
            .use(markdown())
            .use(partial({
                directory: 'src/partials',
                engine: 'swig'
            }))
            .use(templates({
                'engine': 'swig',
                'directory': '_layouts'
            }))
            .build(testDone);
    });
});
