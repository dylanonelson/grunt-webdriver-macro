/*
 * grunt-webdriver-macro
 * https://github.com/dylanonelson/grunt-webdriver-macro
 *
 * Copyright (c) 2016 Dylan Nelson
 * Licensed under the MIT license.
 */

'use strict';

var config = require('../lib/configWatcher');
var macroSelenium = require('../lib/macroSelenium');
var readline = require('readline');
var chalk = require('chalk');

module.exports = function(grunt) {

  grunt.registerMultiTask('macro', 'Grunt plugin for automating browser manipulation during front end development.', function() {
    var done = this.async();
    var macros = null, driver = null;
    var DEFAULT_SELENIUM_VERSION = '2.53.0';

    if (typeof this.data.macroFile === 'undefined') {
      done(new Error('No macrofile provided'));
    }

    config.initialize(this.data.macroFile);
    config.watch();

    macroSelenium.checkForSelenium().then(function (started) {
      if (started) {
        console.log(chalk.bold.blue('Selenium server is already running locally. Skipping Selenium installation and startup.'));
        return;
      } else {
        macroSelenium.start(this.data.seleniumVersion || DEFAULT_SELENIUM_VERSION).then(function(hub) {
          driver = config.macros().setup(hub);
        })
      }
    }.bind(this))

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    var endTask = function () {
      config.macros().quit(driver);
      macroSelenium.shutdown();
      rl.close();
      done();
    }

    rl.on('line', function(line) {
      if (line === 'quit') {
        endTask()
      }

      if (typeof config.macros()[line] != 'undefined') {
        config.macros()[line](driver);
      } else {
        console.log(chalk.red('You have not defined a macro for ' + line + '.'));
      }
    });
  });

};
