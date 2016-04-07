/*
 * grunt-webdriver-macro
 * https://github.com/dylanonelson/grunt-webdriver-macro
 *
 * Copyright (c) 2016 Dylan Nelson
 * Licensed under the MIT license.
 */

'use strict';

var chalk = require('chalk');
var readline = require('readline');

var config = require('../lib/configWatcher');
var macroSelenium = require('../lib/macroSelenium');

module.exports = function(grunt) {

  grunt.registerMultiTask('macro', 'Grunt plugin for automating browser manipulation during front end development.', function() {
    var done = this.async();
    var macros = null, driver = null;
    var DEFAULT_SELENIUM_VERSION = '2.53.0';
    var DEFAULT_FILE_PATH = './macroFile.js';

    if (typeof this.data.macroFile === 'undefined') {
      done(new Error('No macrofile provided'));
    }

    config.initialize(this.data.macroFile || DEFAULT_FILE_PATH);
    config.watch();

    macroSelenium.start(this.data.seleniumVersion || DEFAULT_SELENIUM_VERSION)
      .then(function(hub) {
        driver = config.macros().setup(hub);
      })
      .catch(function (error) {
        console.log('\n');
        done(false);
      });

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
        try {
          config.macros()[line](driver);
        } catch (e) {
          console.log(chalk.blue('Selenium threw an error while executing your macro ' + '(' + line + '):'));
          console.log(e);
          console.log('\n');
        }
      } else {
        console.log(chalk.red('You have not defined a macro for ' + line + '.'));
      }
    });
  });

};
