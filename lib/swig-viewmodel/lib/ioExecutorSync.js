'use strict';

var spawnSync = require('child_process').spawnSync;

module.exports = function ioExecutorSync(command, parameters) {
    return function(inputBufferOrString) {
        var output = spawnSync(command, parameters, { input: inputBufferOrString });
        if (!output) {
            console.error('Command not found:', command);
            return '';
        }

        var stderr = output.stderr.toString();
        if (stderr) {
            console.error('=== first bytes of stdin for', command, '===');
            console.error(inputBufferOrString.toString().substr(0,500));
            console.error('=== stderr for', command, '===');
            console.error(stderr);
        }
        if (output.status > 0) {
            console.error('Command returned with an exit code', output.status);
            return '';
        } else {
            return output.stdout.toString();
        }
    }
};
