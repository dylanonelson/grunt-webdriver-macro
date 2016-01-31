/*
 * grunt-webdriver-macro
 * https://github.com/dylanonelson/grunt-webdriver-macro
 *
 * Copyright (c) 2016 Dylan Nelson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    grunt.registerMultiTask('macro', 'Grunt plugin for automating browser manipulation during front end development.', function() {
        var wd = require('webdriver-sync');
        var Driver = wd.RemoteWebDriver;

        var hub = process.env.SELENIUM_HUB || "http://127.0.0.1:4444/wd/hub";

        var capabilities = wd.DesiredCapabilities["firefox"]();
        var driver = new wd.RemoteWebDriver(hub, capabilities);
    });

};
