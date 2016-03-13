module.exports = {
  setup: function(hub) {
    var wd = require('webdriver-sync');
    var Driver = wd.RemoteWebDriver;
    var capabilities = wd.DesiredCapabilities["firefox"]();

    return new wd.RemoteWebDriver(hub, capabilities);
  },
  quit: function (driver) {
    driver.quit();
  }
}
