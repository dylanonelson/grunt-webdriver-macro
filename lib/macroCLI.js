var readline = require('readline');
var chalk = require('chalk');
var q = require('q');

var config = require('./macroConfig');

var interface = null;

var reopenLogging = function () {
  console.log(chalk.styles.green.open);
}

module.exports.error = function (msg) {
  console.log(chalk.bold.red(msg) + chalk.styles.green.open);
}

module.exports.notify = function (msg) {
  console.log('\n' + chalk.bold.blue(msg) + '\n' + chalk.styles.green.open);
}

module.exports.write = function (msg) {
  console.log(chalk.cyan(msg) + '\n');
}
module.exports.resetPrompt = function () {
  if (interface != null) {
    interface.prompt();
  }
}

module.exports.log = function (msg) {
  console.log(chalk.green(msg));
}

module.exports.start = function () {
  return q.Promise(function (resolve, reject, notify) {
    interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    interface.setPrompt(chalk.yellow('\nMACRO> '));
    interface.prompt();
    interface.on('line', function (l) {
      reopenLogging();
      if (config.hasMacro(l) === false) {
        module.exports.error('You have not defined a macro for <' + l + '>.');
      } else {
        config.executeMacro(l);
      }
      if (l === 'quit') {
        resolve();
        return;
      }
      module.exports.resetPrompt();
    });
  })
}

module.exports.shutdown = function () {
  interface.close();
}
