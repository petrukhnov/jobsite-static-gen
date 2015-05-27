'use strict';

var spawnSync = require('child_process').spawnSync;

module.exports = function rst2html(rstString) {
    return spawnSync('rst2html', ['--template=rst2html-template.txt'], { input: rstString }).stdout.toString();
};
