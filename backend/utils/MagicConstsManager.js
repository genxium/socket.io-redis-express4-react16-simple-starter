const singleton = Symbol();
const singletonEnforcer = Symbol();
const MagicConsts = require('../models/magic_consts');

class MagicConstsManager {
  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new MagicConstsManager(singletonEnforcer);
    }
    return this[singleton];
  }

  constructor(enforcer) {
    if (enforcer != singletonEnforcer) {
      throw "Cannot construct singleton";
    }

    this.magicConsts = {};
  }

  initMagicConstsAsync() {
    const instance = this;
    return MagicConsts.findAll()
      .then(function(rows) {
        for (let row of rows) {
          instance.magicConsts[row.key.toUpperCase()] = row.val;
        }
        return new Promise(function(resolve, reject) {
          resolve(true);
        });
      });
  }
}

module.exports = MagicConstsManager;

