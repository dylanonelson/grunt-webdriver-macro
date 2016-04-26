'use strict';

var chokidar = require('chokidar');
var path = require('path');

var cli = require('./macroCLI');

var macroPath = null;
var macroObj = null;
var macroDriver = null;

var reloadMacro = function () {
  try {
    macroObj = require(macroPath)(macroDriver);
  } catch (e) {
    cli.error('There was an error while loading your macro definitions.\n' +
        'Try editing and saving the file to regain access to your macros.\n\n' + 
        e);
    macroObj = {};
  } finally {
    cli.resetPrompt();
  }
}

module.exports.initialize = function (macroConfigPath, driver) {
  macroPath =
    path.isAbsolute(macroConfigPath) ? macroConfigPath :
        path.resolve(process.cwd(), macroConfigPath);

  macroDriver = driver;
  cli.notify('Loading macros...');
  reloadMacro();
}

module.exports.watch = function () {
  cli.notify('Watching macro definitions for changes...');

  chokidar.watch(macroPath).on('change', function(event) {
    cli.write('Change detected; reloading macro definitions.');
    delete require.cache[macroPath];
    reloadMacro();
  });
}

module.exports.macros = function () {
  return macroObj;
}

module.exports.hasMacro = function (m) {
  if (typeof macroObj[m] === 'function') {
    return true;
  } else {
    return false;
  }
}

module.exports.executeMacro = function (m) {
  try {
    macroObj[m]();
  } catch (e) {
    cli.notify('There was an error while executing macro ' + m + ':');
    cli.error(e);
  }
}
