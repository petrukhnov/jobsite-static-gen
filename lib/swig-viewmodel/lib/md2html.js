'use strict';

var spawnSync = require('child_process').spawnSync;

module.exports = function md2html(rstString) {
    return spawnSync('markdown_py', { input: rstString }).stdout.toString();
};
