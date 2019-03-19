'use strict';

const NetworkFunc = require('../common/NetworkFunc');
const constants = require('../common/constants');

const singleton = Symbol();
const singletonEnforcer = Symbol();
const logger = require('./utils/Logger').instance.getLogger();

const baseAbsPath = __dirname + '/';
const util = require("util");

class SingleRoleLoginCache {
  constructor(props) {
    this.props = props;
  }

  getASync(intAuthToken) {
    const instance = this;
    if (instance.props.modelClass.name == 'admin_login') {
      // Use redis.     
    } else {
      // Use sequelize with MySQLServer.        
    }
    return instance.props.modelClass.findOne({
      where: {
        int_auth_token: intAuthToken,
        updated_at: {
          $gte: NetworkFunc.currentSecs() - instance.props.loginMaxDurationSeconds
        },
        deleted_at: null
      }
    })
    .then((res) => {
      if (!NetworkFunc.isEmpty(res)) {
        return (res.dataValues);
      } else {
        return (null);
      }
    })
    .catch(function(err) {
      logger.error(err);
      throw err;
    });
  }

  setAsync(data) {
    /*
     * Reference http://docs.sequelizejs.com/class/lib/model.js~Model.html#static-method-upsert, DON'T use it against MySQL as we're NOT having a 
     * composite key as the implicit index for `upsert`.
     */
    const instance = this;
    const whereObj = {};
    whereObj[instance.props.idFieldName] = data[instance.props.idFieldName];
    return instance.props.modelClass.findOne({
      where: whereObj
    })
      .then((result) => {
        if (result) {
          return result.updateAttributes({
            int_auth_token: data.int_auth_token,
            updated_at: NetworkFunc.currentSecs(),
            from_public_ip: data.from_public_ip
          })
            .then((updateResult) => {
              return new Promise(function(resolve, reject) {
                resolve(updateResult);
              });
            })
            .catch(err => {
              logger.error(err);
              throw err;
            });
        } else {
          const currentSecs = NetworkFunc.currentSecs();
          const buildObj = {
            'int_auth_token': data.int_auth_token,
            'from_public_ip': data.from_public_ip,
            'created_at': currentSecs,
            'updated_at': currentSecs,
          };
          buildObj[instance.props.idFieldName] = data[instance.props.idFieldName];

          return instance.props.modelClass.build(buildObj)
            .save()
            .then((loginRecord) => {
              return (loginRecord);
            })
            .catch(function(err) {
              logger.error(err);
              throw err;
            });
        }
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });
  }

  delAsync(intAuthToken) {
    const instance = this;
    return instance.props.modelClass.update({
      deleted_at: NetworkFunc.currentSecs()
    }, {
      where: {
        int_auth_token: intAuthToken,
      }
    });
  }
}

class RoleLoginCacheCollection {
  constructor(props) {
    this.props = props;
    this._cacheCollection = {};
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new RoleLoginCacheCollection(singletonEnforcer);
    }
    return this[singleton];
  }

  getOrCreateCacheSync(modelClass, idFieldName, loginMaxDurationSeconds) {
    const instance = this;
    const namespace = modelClass.name;
    if (undefined !== instance._cacheCollection[namespace] && null !== instance._cacheCollection[namespace]) return instance._cacheCollection[namespace];
    const props = {
      modelClass: modelClass,
      idFieldName: idFieldName,
      loginMaxDurationSeconds: loginMaxDurationSeconds,
    };
    const newCache = new SingleRoleLoginCache(props);
    instance._cacheCollection[namespace] = newCache;
    return newCache;
  }
}

module.exports = RoleLoginCacheCollection;
