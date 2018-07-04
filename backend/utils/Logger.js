const baseAbsPath = __dirname + '/';

const singleton = Symbol();
const singletonEnforcer = Symbol();

const constants = require(baseAbsPath + '../../common/constants');
const bunyan = require('bunyan');
const PrettyStream = require('bunyan-prettystream');

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

class Logger {
  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new Logger(singletonEnforcer);
    }
    return this[singleton];
  }

  constructor(enforcer) {
    if (enforcer != singletonEnforcer) {
      throw "Cannot construct singleton";
    }
    const instance = this;
    instance.DEFAULT = 'default';
    this._defaultLogger = bunyan.createLogger({
      name: instance.DEFAULT,
      streams: [
        {
          level: constants.IS_DEVELOPMENT ? 'debug' : 'info',
          stream: prettyStdOut
        }
      ]
    });
    this._loggerDict = {};
    this._loggerDict[this.DEFAULT] = this._defaultLogger;
  }

  getLogger(prefix, name) {
    const instance = this;
    if (undefined === name || null === name) {
      return instance._defaultLogger;
    }
    if (name in instance._loggerDict) {
      return instance._loggerDict[name];
    }
    return bunyan.createLogger({
      name: name,
      streams: [
        {
          level: constants.IS_DEVELOPMENT ? 'debug' : 'info',
          stream: prettyStdOut
        }
      ]
    });
  }
}

module.exports = Logger;
