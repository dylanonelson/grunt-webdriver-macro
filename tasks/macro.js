/*
 * grunt-webdriver-macro
 * https://github.com/dylanonelson/grunt-webdriver-macro
 *
 * Copyright (c) 2016 Dylan Nelson
 * Licensed under the MIT license.
 */

'use strict';

var configWatcher = require('./configWatcher');
var macroSelenium = require('./macroSelenium');

module.exports = function(grunt) {

  grunt.registerMultiTask('macro', 'Grunt plugin for automating browser manipulation during front end development.', function() {
    var done = this.async();
    var macros = null, driver = null;

    if (typeof this.data.macroFile === 'undefined') {
      done(new Error('No macrofile provided'));
    }

    macros = configWatcher.getMacros(this.data.macroFile);
    configWatcher.watchMacroFile();

    macroSelenium.start().then(function(hub) {
        driver = macros.setup(hub);
    })
  });

};
