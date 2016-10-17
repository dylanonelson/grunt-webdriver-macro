/*
 * grunt-webdriver-macro
 * https://github.com/dylanonelson/grunt-webdriver-macro
 *
 * Copyright (c) 2016 Dylan Nelson
 * Licensed under the MIT license.
 */

'use strict';

var q = require('q');
var readline = require('readline');

var cli = require('../lib/macroCLI');
var config = require('../lib/macroConfig');
var selenium = require('../lib/macroSelenium');

module.exports = function(grunt) {

  grunt.registerMultiTask('macro', 'Grunt plugin for automating browser' +
      'manipulation during front end development.', function() {

    var data = this.data;
    var done = this.async();

    var DEFAULT_FILE_PATH = './macroFile.js';
    var DEFAULT_SELENIUM_VERSION = '2.53.0';

    if (typeof data.macroFile === 'undefined') {
      done(new Error('No macrofile provided.'));
    }

    var endTask = function (error) {
      if (error) cli.error(error);
      selenium.shutdown();
      cli.shutdown();
      done(error);
    };

    selenium.start(data.seleniumVersion || DEFAULT_SELENIUM_VERSION)
    .then(function(hub) {
      return q.Promise(function (resolve, reject, notify) {
        var driver = data.setup(hub);
        resolve(driver);
      })
    })
    .then(function (driver) {
      config.initialize(data.macroFile || DEFAULT_FILE_PATH, driver);
      config.watch();
      return cli.start();
    })
    .then(function () {
      endTask();
    })
    .catch(function (error) {
      endTask(error);
    })

  });
};
