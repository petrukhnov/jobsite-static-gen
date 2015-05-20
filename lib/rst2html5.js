'use strict';

var spawnSync = require('child_process').spawnSync;

module.exports = function rst2html5(rstString) {
    return spawnSync('rst2html5', [], { input: rstString }).stdout.toString();
};
