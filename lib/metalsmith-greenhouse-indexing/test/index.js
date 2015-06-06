var _ = require('underscore'),
    fs = require('fs'),
    assert = require('chai').assert,
    metalsmith = require('metalsmith'),
    greenhouseIndexing = require('..'),
    utils = require('../lib/utils.js');

describe('metalsmith-greenhouse-indexing', function() {

    describe('generate indexable jobs data', function() {

        function runMetalsmith(assertOutput, done) {
            var FAKE_BUILD_FOLDER = 'test';

            metalsmith(FAKE_BUILD_FOLDER)
                .metadata({
                    greenhouse: {
                        jobs: greenhouseJobsFixture()
                    }
                })
                .use(greenhouseIndexing({
                    outputPath: FAKE_BUILD_FOLDER + '/build'
                }))
                .use(assertOutput)
                .build(done);
        }

        it('should create indexableJobs.json file', function(done) {

            function assertOutput(files, metalsmith, done) {

                fs.readFile('test/build/indexableJobs.json', { encoding: 'utf8' }, function(err, data) {
                    if (err) throw err;

                    var jobs = JSON.parse(data);
                    assert.isDefined(jobs);
                    assert.strictEqual(jobs.length, 2);

                    done();
                });
            }

            runMetalsmith(assertOutput, done);
        });

    });
});

function greenhouseJobsFixture() {
    return JSON.parse(fs.readFileSync('test/fixtures/greenhouse-jobs.json'));
}

function jobsFixture() {
    return greenhouseJobsFixture().map(utils.mapGreenhouseJob);
}

function expectedSearchResults() {
    return {
        'big data': ['65948'],
        'cloud': ['65991'],
        'berlin': ['65948', '65991'],
        'Berlin': ['65948', '65991'],
        'Special': ['65991']
    }
}

function lunrJobsIndex() {
    var index = utils.initialLunrJobsIndex();

    var jobs = jobsFixture();
    _.each(jobs, function(job) {
        index.add(job);
    });

    return index;
}
