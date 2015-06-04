var lunr = require('lunr'),
    _ = require('underscore'),
    fs = require('fs'),
    assert = require('chai').assert,
    metalsmith = require('metalsmith'),
    greenhouseIndexing = require('..'),
    utils = require('../lib/utils.js');

describe('metalsmith-greenhouse-indexing', function() {
    describe('lunr.js usage', function() {
        var initialIndex,
            initialIndexStringified;

        beforeEach(function() {
            initialIndex = lunrJobsIndex();
            initialIndexStringified = JSON.stringify(initialIndex.toJSON());
        });

        it('should export and import index as string', function() {
            var index = lunr.Index.load(JSON.parse(initialIndexStringified)),
                indexStringified;

            indexStringified = JSON.stringify(index.toJSON());

            assert.strictEqual(initialIndexStringified, indexStringified);
        });

        it('should find results in initial index', function() {
            var index = initialIndex,
                search,
                expectedResults = expectedSearchResults();

            _.each(expectedResults, function(value, key) {
                search = index.search(key);
                assert.deepEqual(_.pluck(search, 'ref'), value);
            });
        });

        it('should find results in loaded index', function() {
            var index = lunr.Index.load(JSON.parse(initialIndexStringified)),
                search,
                expectedResults = expectedSearchResults();

            _.each(expectedResults, function(value, key) {
                search = index.search(key);
                assert.deepEqual(_.pluck(search, 'ref'), value);
            });
        });
    });

    describe('metalsmith-greenhouse-indexing using lunr.js', function() {

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

        it('should create lunr.js index for greenhouse jobs content', function(done) {

            function assertOutput(files, metalsmith, done) {
                var lunrIndex,
                    lunrIndexStringified,
                    indexing,
                    greenhouseJobsIndexing;

                lunrIndex = lunrJobsIndex();
                lunrIndexStringified = JSON.stringify(lunrIndex.toJSON());

                indexing = metalsmith.metadata().indexing;
                assert.isDefined(indexing);
                greenhouseJobsIndexing = indexing.greenhouse_jobs;
                assert.isDefined(greenhouseJobsIndexing);

                assert.strictEqual(greenhouseJobsIndexing.engine, 'lunr.js');
                assert.strictEqual(greenhouseJobsIndexing.json, lunrIndexStringified);

                done();
            }

            runMetalsmith(assertOutput, done);
        });

        it('should return right search results', function(done) {

            function assertOutput(files, metalsmith, done) {
                var indexing,
                    greenhouseJobsIndexing,
                    lunrIndex,
                    expectedResults;

                indexing = metalsmith.metadata().indexing;
                assert.isDefined(indexing);
                greenhouseJobsIndexing = indexing.greenhouse_jobs;
                assert.isDefined(greenhouseJobsIndexing);

                lunrIndex = lunr.Index.load(JSON.parse(greenhouseJobsIndexing.json))

                // assert search results
                expectedResults = expectedSearchResults();
                _.each(expectedResults, function(value, key) {
                    search = lunrIndex.search(key);
                    assert.deepEqual(_.pluck(search, 'ref'), value);
                });

                done();
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
