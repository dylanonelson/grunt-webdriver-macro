/*
 * grunt-webdriver-macro
 * https://github.com/dylanonelson/grunt-webdriver-macro
 *
 * Copyright (c) 2016 Dylan Nelson
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var request = require('request');
var chokidar = require('chokidar');
var q = require('q');
var selenium = require('selenium-standalone');

module.exports = function(grunt) {

  grunt.registerMultiTask('macro', 'Grunt plugin for automating browser manipulation during front end development.', function() {
    var done = this.async();

    if (typeof this.data.macroFile === 'undefined') {
      done(new Error('No macrofile provided'));
    }

    var macroConfigPath = path.resolve(process.cwd(), this.data.macroFile);
    var macroConfig = require(macroConfigPath);

    // Watch for changes to the macrofile
    console.log('Watching macro definitions for changes...');
    chokidar.watch(macroConfigPath).on('change', function(event) {
      console.log('Change detected; reloading macro definitions.');
      delete require.cache[macroConfigPath];
      macroConfig = require(macroConfigPath);
    });

    // Start Selenium server and log output
    var installSelenium = function() {
      selenium.install()
    };

    var startSelenium = function() {
      console.log('Starting Selenium server...');
      selenium.start({
          spawnOptions: {
            detached: true
          }
        }, function(err, child) {
          if (err != undefined) {
            console.log('There was an error starting the Selenium server');
          }
          child.stderr.on('data', function (data) {
            console.log(data.toString());
          });
      });
    };

    // Wait for Selenium server startup
    var checkForSelenium = function () {
      var interval = setInterval(function() {
        request.get('http://127.0.0.1:4444/wd/hub', function (error, response, body) {
          if (error != undefined) {
            return;
          }
          if (response != undefined && response.statusCode === 200) {
            clearInterval(interval);
            console.log('Connection established!');
          }
        }).on('error', function (e) {
          return;
        })
      }, 200);
    }

    q(installSelenium).then(startSelenium).then(checkForSelenium);

  });

};
