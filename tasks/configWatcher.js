'use strict';
var chokidar = require('chokidar');
var path = require('path');
var macroPath = null;
var macroObj = null;

module.exports.initialize = function (macroConfigPath) {
  macroPath =
    path.isAbsolute(macroConfigPath) ? macroConfigPath : path.resolve(process.cwd(), macroConfigPath);

  macroObj = require(macroPath);
}

// Watch for changes to the macrofile
module.exports.watch = function () {
  console.log('Watching macro definitions for changes...');

  chokidar.watch(macroPath).on('change', function(event) {
    console.log('Change detected; reloading macro definitions.');
    delete require.cache[macroPath];
    macroObj = require(macroPath);
  });
}

module.exports.macros = function () {
  return macroObj;
}
