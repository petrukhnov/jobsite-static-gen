var fs = require('fs'),
    assert = require('assert'),
    metalsmith = require('metalsmith'),
    greenhouseImgurl = require('..');

describe('metalsmith-greenhouse-imgurl', function() {
    it('should extract images from Greenhouse jobs into imgurls', function(testDone) {
        function testFixture() {
            return JSON.parse(fs.readFileSync('test/fixtures/metalsmith-greenhouse-jobs.js'));
        }
        function assertOutput(files, metalsmith, done) {
            var meta = metalsmith.metadata();
            assert.deepEqual([{
                    origUrl: 'https://prismic-io.s3.amazonaws.com/zalando-jobsite%2F5bacf42e-296e-466c-b2b0-c0db0b7a3c97_14213238888_45057f7135_m.jpg',
                    fileName: '5bacf42e-296e-466c-b2b0-c0db0b7a3c97_14213238888_45057f7135_m.jpg'
                },{
                    origUrl: 'https://prismic-io.s3.amazonaws.com/zalando-jobsite%2Fe2deeddb-cf1d-4ccc-8c16-b36b8c94793c_cloud_specialist.jpg',
                    fileName: 'e2deeddb-cf1d-4ccc-8c16-b36b8c94793c_cloud_specialist.jpg'
                }],
                meta.imgurls);

            done();
        }

        var FAKE_BUILD_FOLDER = 'test';

        metalsmith(FAKE_BUILD_FOLDER)
            .metadata({
                greenhouse: {
                    jobs: testFixture()
                }
            })
            .use(greenhouseImgurl())
            .use(assertOutput)
            .build(testDone);
    });
});
