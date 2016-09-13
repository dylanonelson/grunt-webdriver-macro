var selenium = require('selenium-standalone');
var request = require('request');
var q = require('q');

var cli = require('./macroCLI');

var seleniumProcess = null;

module.exports.start = function (version) {

  var SELENIUM_HUB = 'http://127.0.0.1:4444/wd/hub';

  // Check for Selenium instance already running
  var checkForSelenium = function () {
    return q.Promise(function (resolve, reject, notify) {
      request.get('http://127.0.0.1:4444/wd/hub', function (error, response, body) {
        if (error != undefined) {
          resolve();
        } else if (response != undefined && response.statusCode === 200) {
          reject('Selenium server is already running locally.\n' +
              'Skipping Selenium installation and startup.');
        } else {
          reject(error);
        }
      })
    })
  }

  // Start Selenium server and log output
  var installSelenium = function() {
    return q.Promise(function (resolve, reject, notify) {
      selenium.install({
        version: version,
        baseURL: 'https://selenium-release.storage.googleapis.com',
        drivers: {
          chrome: {
            version: '2.21',
            baseURL: 'https://chromedriver.storage.googleapis.com'
          }
        },
        logger: function (message) {
          cli.log(message);
        }
      }, function (err) {
        if (err != null) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
  };

  var startSelenium = function () {
    return q.Promise(function (resolve, reject, notify) {
      cli.notify('Starting Selenium server...');
      selenium.start({
        version: version,
        spawnOptions: {
          stdio: ['ignore', 'ignore', process.stderr]
        }
      }, function (err, child) {
          if (err != undefined) {
            reject(err);
          } else {
            seleniumProcess = child;
            resolve();
          }
      });
    })
  };

  // Wait for Selenium server startup
  var waitForSelenium = function () {
    return q.Promise(function (resolve, reject, notify) {
      var counter = 0;

      var interval = setInterval(function() {
        request.get('http://127.0.0.1:4444/wd/hub', function (error, response, body) {
          if (error != undefined) {
            counter++;
            if (counter > 50) {
              reject(new Error('Selenium server failed to start after 10 seconds.'));
            }
          }
          if (response != undefined && response.statusCode === 200) {
            clearInterval(interval);
            cli.notify('Connection established!');
            resolve(SELENIUM_HUB);
          }
        })
      }, 200);
    });
  };

  var handleRejection = function (rejection) {
    return q.Promise(function (resolve, reject, notify) {
      if (typeof rejection === 'string') {
        cli.notify(rejection);
        resolve(SELENIUM_HUB);
      } else {
        reject(rejection);
      }
    })
  };

  return checkForSelenium()
    .then(installSelenium)
    .then(startSelenium)
    .then(waitForSelenium)
    .catch(handleRejection);
};

module.exports.shutdown = function () {
  // Don't try to kill process if it wasn't kicked off by this one
  if (seleniumProcess != null) {
    seleniumProcess.kill();
  }
}
