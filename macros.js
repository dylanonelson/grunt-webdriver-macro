module.exports = {
  setup: function() {
    var wd = require('webdriver-sync');
    var Driver = wd.RemoteWebDriver;
    var hub = process.env.SELENIUM_HUB || "http://127.0.0.1:4444/wd/hub";
    var capabilities = wd.DesiredCapabilities["firefox"]();

    return new wd.RemoteWebDriver(hub, capabilities);
  }
}
