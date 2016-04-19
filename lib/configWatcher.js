'use strict';

var chokidar = require('chokidar');
var path = require('path');
var chalk = require('chalk');

var macroPath = null;
var macroObj = null;
var macroDriver = null;

var reloadMacro = function () {
  try {
    macroObj = require(macroPath)(macroDriver);
  } catch (e) {
    console.log(chalk.bold.red('\nThere was an error while loading your macro definitions.\n' +
                               'Try editing and saving the file to regain access to your macros.\n'));
    console.log(chalk.red(e));
    macroObj = {};
  }
}

module.exports.initialize = function (macroConfigPath, driver) {
  macroPath =
    path.isAbsolute(macroConfigPath) ? macroConfigPath : path.resolve(process.cwd(), macroConfigPath);

  macroDriver = driver;
  reloadMacro();
}

// Watch for changes to the macrofile
module.exports.watch = function () {
  console.log(chalk.bold.blue('Watching macro definitions for changes...'));

  chokidar.watch(macroPath).on('change', function(event) {
    console.log(chalk.bold.blue('Change detected; reloading macro definitions.'));
    delete require.cache[macroPath];
    reloadMacro();
  });
}

module.exports.macros = function () {
  return macroObj;
}
