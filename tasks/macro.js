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
var q = require('q');

var config = require('../lib/configWatcher');
var macroSelenium = require('../lib/macroSelenium');

module.exports = function(grunt) {

  grunt.registerMultiTask('macro', 'Grunt plugin for automating browser manipulation during front end development.', function() {
    var done = this.async();
    var data = this.data;
    var rl = null;
    var DEFAULT_SELENIUM_VERSION = '2.53.0';
    var DEFAULT_FILE_PATH = './macroFile.js';

    if (typeof data.macroFile === 'undefined') {
      done(new Error('No macrofile provided'));
    }

    macroSelenium.start(data.seleniumVersion || DEFAULT_SELENIUM_VERSION)
    .then(function(hub) {
      return q.Promise(function (resolve, reject, notify) {
        console.error(chalk.styles.green.open);
        var driver = data.setup(hub);
        resolve(driver);
      })
    })
    .then(function (driver) {
      config.initialize(data.macroFile || DEFAULT_FILE_PATH, driver);
      config.watch();
    })
    .then(function() {
      return q.Promise(function (resolve, reject, notify) {
        rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.setPrompt(chalk.blue.bold('\nMACRO> '));
        rl.on('line', function(line) {
          console.log(chalk.styles.green.open);
          if (line === 'quit') {
            reject();
            return;
          }

          if (typeof config.macros()[line] != 'undefined') {
            try {
              config.macros()[line]();
              rl.prompt();
            } catch (e) {
              console.log(chalk.blue('Your macro threw an error  ' + '(' + line + '):'));
              console.log(e);
              console.log('\n');
            }
          } else {
            console.log(chalk.red('You have not defined a macro for ' + line + '.'));
          }
        });
        rl.prompt();
      })
    })
    .catch(function (error) {
      console.log('\n');
      config.macros().quit();
      macroSelenium.shutdown();
      rl.close();
      done(error);
    })

  });
};
