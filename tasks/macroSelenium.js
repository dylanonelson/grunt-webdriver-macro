var selenium = require('selenium-standalone');
var request = require('request');
var q = require('q');
var seleniumProcess = null;

module.exports.start = function () {
  // Start Selenium server and log output
  var installSelenium = function() {
    return q.Promise(function (resolve, reject, notify) {
      console.log("Hello");
      selenium.install({
        version: '2.53.0',
        baseURL: 'https://selenium-release.storage.googleapis.com',
        drivers: {
          chrome: {
            version: '2.21',
            baseURL: 'https://chromedriver.storage.googleapis.com'
          }
        },
        logger: function (message) {
          console.log(message);
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
    console.log('Starting Selenium server...');
    selenium.start({
      version: '2.53.0',
    }, function (err, child) {
        if (err != undefined) {
          console.log('There was an error starting the Selenium server');
          console.log(err);
        }
        child.stderr.on('data', function (data) {
          console.log(data.toString());
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
            console.log('Connection established!');
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
