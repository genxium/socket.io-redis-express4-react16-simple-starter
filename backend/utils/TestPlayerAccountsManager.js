const singleton = Symbol();
const singletonEnforcer = Symbol();
const PlayerTest = require('../models/player_test');
const Player = require('../models/player');
const NetworkFunc = require('../../common/NetworkFunc');
const Promise = require('bluebird');
const MySQLManager = require('./MySQLManager');

class TestPlayerAccountsManager {
  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new TestPlayerAccountsManager(singletonEnforcer);
    }
    return this[singleton];
  }

  constructor(enforcer) {
    if (enforcer != singletonEnforcer) {
      throw "Cannot construct singleton";
    }
  }

  initTestPlayerAccountsAsync() {
    const instance = this;
    return PlayerTest.findAll({
      offset: 0, 
      limit: 100,     
  })
      .then(function(rows) {
        return Promise.reduce(rows, (total, row) => {
          const whereObj = {};
          const uniqueNameFieldName = 'unique_name';
          whereObj[uniqueNameFieldName] = row[uniqueNameFieldName];
          return Player.findOne({
            where: whereObj
          })
            .then((result) => {
              const currentSecs = NetworkFunc.currentSecs();
              if (result) {
                return result.updateAttributes({
                  updated_at: currentSecs,
                })
                .then((updateResult) => {
                  return ++total;
                });
              } else {
                return MySQLManager.instance.dbRef.query('INSERT INTO player (unique_name, raw_password, created_at, updated_at) VALUES ($1, $2, $3, $4)',
                  { 
                    bind: [row.unique_name, row.raw_password, currentSecs, currentSecs], 
                    type: MySQLManager.instance.dbRef.QueryTypes.INSERT, 
                  }
                )
                .then((insertedId) => {
                  return ++total;
                });
              }
            })
        }, 0);
      });
  }
}

module.exports = TestPlayerAccountsManager;
