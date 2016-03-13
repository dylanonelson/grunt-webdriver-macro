var selenium = require('selenium-standalone');
var request = require('request');
var q = require('q');
var seleniumProcess = null;

module.exports.start = function () {
  // Start Selenium server and log output
  var installSelenium = function() {
    selenium.install()
  };

  var startSelenium = function () {
    console.log('Starting Selenium server...');
    selenium.start({
        spawnOptions: {
          detached: true
        }
      }, function (err, child) {
        if (err != undefined) {
          console.log('There was an error starting the Selenium server');
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

  return q(installSelenium).then(startSelenium).then(checkForSelenium);
}

module.exports.shutdown = function () {
  seleniumProcess.kill();
}
