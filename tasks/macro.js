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

module.exports = function(grunt) {

  grunt.registerMultiTask('macro', 'Grunt plugin for automating browser manipulation during front end development.', function() {
    var done = this.async();
    var macros = null, driver = null;

    if (typeof this.data.macroFile === 'undefined') {
      done(new Error('No macrofile provided'));
    }

    config.initialize(this.data.macroFile);
    config.watch();

    macroSelenium.start().then(function(hub) {
      driver = config.macros().setup(hub);
    })

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
        console.log('You have not defined a macro for ' + line + '.');
      }
    });
  });

};
