const baseAbsPath = __dirname + '/';
const Sqlite3 = require('sqlite3');
const singleton = Symbol();
const singletonEnforcer = Symbol();

const yaml = require('js-yaml');
const fs = require('fs');

const Sequelize = require('sequelize');
const Logger = require('./Logger');
const logger = Logger.instance.getLogger(__filename);
const constants = require('../../common/constants');

class SQLiteManager {
  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new SQLiteManager(singletonEnforcer);
    }
    return this[singleton];
  }

  constructor(enforcer) {
    if (enforcer != singletonEnforcer) {
      throw "Cannot construct singleton";
    }

    const instance = this;

    // Refernece https://sequelize.readthedocs.io/en/v3/docs/getting-started/.
    const sqliteConfig = baseAbsPath + (constants.NOT_IN_PRODUCTION ? '../configs/preconfigured.test.sqlite' : '../configs/preconfigured.sqlite');

    this.locationAndIdentity = sqliteConfig;
    this.dbRef = new Sequelize('preconfigured', 'null', 'null', {
      dialect: 'sqlite',
      storage: sqliteConfig,
    });

    this.magicConsts = {};
    this.testConnectionAsync = this.testConnectionAsync.bind(this);
  }

  testConnectionAsync() {
    const instance = this;
    return instance.dbRef.authenticate();
  }
}

module.exports = SQLiteManager;
