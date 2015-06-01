'use strict';

var async = require('async'),
    request = require('request'),
    fs = require('fs-extra'),
    exec = require('child_process').exec;

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Download and resize images referred to in metadata.imgurls
 *
 * @param {Object} options
 *   @property {String} outputBasePath image output directory
 *   @property {Array} outputSizes resized image sizes, as 'WxH' string
 *   @property {Object} createReadStream (optional) callback to create a stream
 *     from string. Defaults to request
 * @return {Function}
 */

function plugin(options) {
    var outputBasePath = requireOption('outputBasePath');
    var outputSizes = requireOption('outputSizes');
    var createReadStream = options.createReadStream || request;

    return function(files, metalsmith, pluginDone) {
        var imgurls = metalsmith.metadata().imgurls;
        var originalsPath = outputBasePath + '/original';
        fs.ensureDirSync(originalsPath);
        async.each(imgurls, download, resize);
 
        function download(imgurl, callback) {
            var writeStream = fs.createWriteStream(originalsPath + '/' + imgurl.fileName);
            writeStream.on('finish', callback);

            createReadStream(imgurl.origUrl).on('error', callback).pipe(writeStream);
        }
        function resize(err) {
            if (err) {
                pluginDone(err);
            }

            async.each(outputSizes, resizeOriginals, pluginDone);
        }
        function resizeOriginals(targetThumbnailSize, done) {
            var outputPath = outputBasePath + '/' + targetThumbnailSize;
            fs.ensureDirSync(outputPath);

            exec(['mogrify',
                '-path', outputPath,
                '-resize', targetThumbnailSize+'^', //keep ratio, minimum of width/height
                '-quality 60',
                originalsPath+'/*'].join(' '), function(err, stdout, stderr) {

                process.stdout.write(stdout.toString());
                process.stderr.write(stderr.toString());
                done(err);
            });
        }
    }

    function requireOption(name) {
        if (options[name] == null) {
            throw new TypeError('Missing required option \'' + name + '\'');
        }
        return options[name];
    }
}
