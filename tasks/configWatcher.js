'use strict';
var chokidar = require('chokidar');
var path = require('path');
var macroPath = null;
var macroObj = null;

module.exports.getMacros = function (macroConfigPath) {
  macroPath =
    path.isAbsolute(macroConfigPath) ? macroConfigPath : path.resolve(process.cwd(), macroConfigPath);

  macroObj = require(macroPath);
  return macroObj;
}

// Watch for changes to the macrofile
module.exports.watchMacroFile = function () {
  console.log('Watching macro definitions for changes...');

  chokidar.watch(macroPath).on('change', function(event) {
    console.log('Change detected; reloading macro definitions.');
    delete require.cache[macroPath];
    macroObj = require(macroPath);
  });
}
