var selenium = require('selenium-standalone');
var request = require('request');
var q = require('q');
var chalk = require('chalk');
var seleniumProcess = null;

module.exports.start = function (version) {
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
          console.log(chalk.green(message));
        }
      }, function (err) {
        if (err != null) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    })
  };

  var startSelenium = function () {
    console.log(chalk.bold.blue('Starting Selenium server...'));
    selenium.start({
      version: version,
    }, function (err, child) {
        if (err != undefined) {
          console.log(chalk.red('There was an error starting the Selenium server'));
          console.log(err);
        }
        child.stderr.on('data', function (data) {
          console.log(chalk.green(data.toString()));
        });

        seleniumProcess = child;
    });
  };

  // Wait for Selenium server startup
  var checkForSelenium = function () {
    return q.Promise(function (resolve, reject, notify) {
      var interval = setInterval(function() {
        request.get('http://127.0.0.1:4444/wd/hub', function (error, response, body) {
          if (error != undefined) {
            return;
          }
          if (response != undefined && response.statusCode === 200) {
            clearInterval(interval);
            console.log(chalk.bold.blue('Connection established!'));
            resolve('http://127.0.0.1:4444/wd/hub');
          }
        }).on('error', function (e) {
          return;
        })
      }, 200);
    });
  }

  return installSelenium().then(startSelenium).then(checkForSelenium);
}

module.exports.shutdown = function () {
  seleniumProcess.kill();
}
