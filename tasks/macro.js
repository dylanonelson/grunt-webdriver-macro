/*
 * grunt-webdriver-macro
 * https://github.com/dylanonelson/grunt-webdriver-macro
 *
 * Copyright (c) 2016 Dylan Nelson
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request');
var q = require('q');
var selenium = require('selenium-standalone');
var configWatcher = require('./configWatcher');

module.exports = function(grunt) {

  grunt.registerMultiTask('macro', 'Grunt plugin for automating browser manipulation during front end development.', function() {
    var done = this.async();
    var macros = null, driver = null;

    if (typeof this.data.macroFile === 'undefined') {
      done(new Error('No macrofile provided'));
    }

    macros = configWatcher.getMacros(this.data.macroFile);
    configWatcher.watchMacroFile();

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
    var checkForSelenium = function() {
      return q.Promise(function (resolve, reject, notify) {
        var interval = setInterval(function() {
          request.get('http://127.0.0.1:4444/wd/hub', function (error, response, body) {
            if (error != undefined) {
              return;
            }
            if (response != undefined && response.statusCode === 200) {
              clearInterval(interval);
              console.log('Connection established!');
              resolve('http://127.0.0.1:4444/wd/hub');
            }
          }).on('error', function (e) {
            return;
          })
        }, 200);
      });
    }

    var setupDriver = function (hub) {
      driver = macros.setup(hub);
    }

    q(installSelenium).then(startSelenium).then(checkForSelenium).then(setupDriver);

  });

};
