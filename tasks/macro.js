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

    var macroConfigPath = path.resolve(process.cwd(), this.data.macroFile);
    var macroConfig = require(macroConfigPath);
    var driver = macroConfig.setup();

    // Watch for changes to the macrofile
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.config.set('watch', {
      macro: {
        files: [this.data.macroFile]
      }
    });
    grunt.task.run('watch:macro');
    grunt.event.on('watch', function(action, filepath, target) {
      console.log('Reloading macro definitions...');
      delete require.cache[macroConfigPath];
      macroConfig = require(macroConfigPath);
    });

  });

};
