/*
 * grunt-webdriver-macro
 * https://github.com/dylanonelson/grunt-webdriver-macro
 *
 * Copyright (c) 2016 Dylan Nelson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    macro: {
      default: {
        macroFile: './macros.js',
        seleniumVersion: '2.50.1'
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

};
