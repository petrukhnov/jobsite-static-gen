var _ = require('underscore'),
    fs = require('fs-extra'),
    assert = require('assert'),
    async = require('async'),
    metalsmith = require('metalsmith'),
    identify = require('imagemagick').identify,
    imgurlReprocessor = require('..');

describe('imgurl-reprocessor', function() {
    it('should convert images from provided URLs into configured sizes', function(testDone) {
        var BUILD_OUTPUT_FOLDER = 'test/build/images';

        function assertOutput(err) {
            if (err) {
                testDone(err);
                return;
            }

            async.parallel([
                assertFeatures('original/tech_zalando_logo_black.png', { format: 'PNG', width: 262, height: 261 }),
                assertFeatures('1440x500/tech_zalando_logo_black.png', { format: 'PNG', width: 1440, height: 1435 }),
                assertFeatures('280x177/tech_zalando_logo_black.png', { format: 'PNG', width: 280, height: 279 }),
                assertFeatures('original/dortmund_flag.jpg', { format: 'JPEG', width: 795, height: 502 }),
                assertFeatures('1440x500/dortmund_flag.jpg', { format: 'JPEG', width: 1440, height: 909 }),
                assertFeatures('280x177/dortmund_flag.jpg', { format: 'JPEG', width: 280, height: 177 })
            ], testDone);
        }

        function assertFeatures(file, expectedFeatures) {
            return function(done) {
                identify(BUILD_OUTPUT_FOLDER+'/'+file, asserter);

                function asserter(err, actualFeatures) {
                    if (err) {
                        done(err);
                        testDone(err);
                    }
                    assert(actualFeatures, 'Did not get features from the image, why?');
                    assert.deepEqual(expectedFeatures, _.pick(actualFeatures, Object.keys(expectedFeatures)));
                    done();
                }
            }
        }

        var FAKE_BUILD_FOLDER = 'test';
        var MOCK_URL_GETTER = fs.createReadStream;

        metalsmith(FAKE_BUILD_FOLDER)
            .metadata({
                imgurls: [{
                    origUrl: 'test/fixtures/tech_zalando_logo_black.png',
                    fileName: 'tech_zalando_logo_black.png'
                },{
                    origUrl: 'test/fixtures/dortmund_flag.jpg',
                    fileName: 'dortmund_flag.jpg'
                }]
            })
            .use(imgurlReprocessor({
                outputBasePath: BUILD_OUTPUT_FOLDER,
                outputSizes: ['1440x500', '280x177'],
                createReadStream: MOCK_URL_GETTER
            }))
            .build(assertOutput);
    });
});
