'use strict';

var chokidar = require('chokidar');
var path = require('path');
var chalk = require('chalk');

var macroPath = null;
var macroObj = null;

module.exports.initialize = function (macroConfigPath) {
  macroPath =
    path.isAbsolute(macroConfigPath) ? macroConfigPath : path.resolve(process.cwd(), macroConfigPath);

  macroObj = require(macroPath);
}

// Watch for changes to the macrofile
module.exports.watch = function () {
  console.log(chalk.bold.blue('Watching macro definitions for changes...'));

  chokidar.watch(macroPath).on('change', function(event) {
    console.log(chalk.bold.blue('Change detected; reloading macro definitions.'));
    delete require.cache[macroPath];
    macroObj = require(macroPath);
  });
}

module.exports.macros = function () {
  return macroObj;
}
