/*
 * grunt-webdriver-macro
 * https://github.com/dylanonelson/grunt-webdriver-macro
 *
 * Copyright (c) 2016 Dylan Nelson
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var chokidar = require('chokidar');

module.exports = function(grunt) {

  grunt.registerMultiTask('macro', 'Grunt plugin for automating browser manipulation during front end development.', function() {
    var done = this.async();

    if (typeof this.data.macroFile === 'undefined') {
      done(new Error('No macrofile provided'));
    }

    var macroConfigPath = path.resolve(process.cwd(), this.data.macroFile);
    var macroConfig = require(macroConfigPath);
    var driver = macroConfig.setup();

    // Watch for changes to the macrofile
    console.log('Watching macro definitions for changes...');
    chokidar.watch(macroConfigPath).on('change', function(event) {
      console.log('Change detected; reloading macro definitions.');
      delete require.cache[macroConfigPath];
      macroConfig = require(macroConfigPath);
    });

  });

};
