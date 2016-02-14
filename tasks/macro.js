/*
 * grunt-webdriver-macro
 * https://github.com/dylanonelson/grunt-webdriver-macro
 *
 * Copyright (c) 2016 Dylan Nelson
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {

  grunt.registerMultiTask('macro', 'Grunt plugin for automating browser manipulation during front end development.', function() {
    if (typeof this.data.macroFile === 'undefined') {
      console.warn('No macrofile provided');
      return;
    }

    var macroConfig = require(path.resolve(process.cwd(), this.data.macroFile));
    var driver = macroConfig.setup();
  });

};
