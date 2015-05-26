'use strict';

var spawnSync = require('child_process').spawnSync;

module.exports = function rst2html(rstString) {
    return spawnSync('rst2html', [], { input: rstString }).stdout.toString();
};
