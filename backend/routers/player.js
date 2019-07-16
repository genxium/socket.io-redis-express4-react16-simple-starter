const baseAbsPath = __dirname + '/';
const express = require('express');
const Promise = require('bluebird');
const constants = require('../../common/constants');
const signals = require('../../common/signals');
const NetworkFunc = require('../../common/NetworkFunc');
const util = require('util');

const magicConsts = require('../utils/MagicConstsManager').instance.magicConsts;

const AbstractAuthRouterCollection = require('./AbstractAuthRouterCollection');
const RoleLoginCacheCollection = require('../RoleLoginCacheCollection');
const PlayerLogin = require('../models/player_login');
const tokenCache = RoleLoginCacheCollection.instance.getOrCreateCacheSync(PlayerLogin, 'player_id', magicConsts.PLAYER_LOGIN_MAX_DURATION);

const Logger = require('../utils/Logger');
const logger = Logger.instance.getLogger(__filename);

const logoutApi = function(req, res) {
  const instance = this;
  const token = req.body.intAuthToken;
  tokenCache.delAsync(token)
    .then(function(trueOrFalse) {
      res.json({
        ret: (trueOrFalse ? constants.RET_CODE.OK : constants.RET_CODE.FAILURE)
      });
    })
    .catch(function(err) {
      instance.respondWithError(res, err);
    });
};

const tokenAuthImpl = function(req, res, next) {
  const instance = this;
  const token = (undefined === req.body || undefined === req.body.intAuthToken ? req.query.intAuthToken : req.body.intAuthToken);
  if (NetworkFunc.isEmpty(token)) {
    return instance.tokenExpired(res);
  }
  tokenCache.getASync(token)
    .then(function(entityInfo) {
      if (null == entityInfo) {
        throw new signals.GeneralFailure(constants.RET_CODE.TOKEN_EXPIRED)
      } else {
        req.loggedInRole = entityInfo;
        throw new signals.GeneralFailure(constants.RET_CODE.OK)
      }
    })
    .catch((err) => {
      if (constants.RET_CODE.OK == err.ret) {
        return next();
      } else {
        return instance.respondWithError(res, err);
      }
    });
};

const createPageRouter = function() {
  const instance = this;
  const router = express.Router({
    mergeParams: true
  });
  router.get(constants.ROUTE_PATHS.TEST, instance.spa.bind(instance));
  return router;
};

const createAuthProtectedApiRouter = function() {
  const instance = this;
  const router = express.Router({
    mergeParams: true
  });

  /**
   * @apiGroup Player 
   * @api {post} /player/api/v:version/intAuthToken/logout IntAuthTokenLogout 
   *
   * @apiParam {Number} version Version number.
   * @apiParam {String} intAuthToken The "internal auth token" acquired from credentials login or smsCaptcha login or other equivalents.
   *
   * @apiSuccess {Number} ret Return code of the api call.
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK 
   *     {
   *       "ret": 1000
   *     }
   */
  router.post(constants.ROUTE_PATHS.INT_AUTH_TOKEN + constants.ROUTE_PATHS.LOGOUT, logoutApi.bind(instance));
  return router;
};

class PlayerRouterCollection extends AbstractAuthRouterCollection {
  constructor(props) {
    super(props);
    const instance = this;
    this.tokenAuth = tokenAuthImpl.bind(instance);

    this.pageRouter = (createPageRouter.bind(instance))();
    this.authProtectedApiRouter = (createAuthProtectedApiRouter.bind(instance))();
  }

  onLoggedInByCredentials(req, res) {
    const instance = this;
    const ip = req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress || '';
    const id = NetworkFunc.isEmpty(req.loggedInRole.id) ? req.loggedInRole.player_id : req.loggedInRole.id;
    tokenCache.setAsync({
      int_auth_token: NetworkFunc.guid(),
      player_id: id,
      from_public_ip: ip
    }).then((result) => {
      if (result) {
        result = result.dataValues;
        res.json({
          ret: constants.RET_CODE.OK,
          intAuthToken: result.int_auth_token,
          id: result.player_id,
          expiresAt: (parseInt(result.updated_at) + parseInt(magicConsts.PLAYER_LOGIN_MAX_DURATION)),
        });
      } else {
        throw new signals.GeneralFailure(constants.RET_CODE.FAILURE);
      }
    })
      .catch(function(err) {
        instance.respondWithError(res, err);
        logger.error(err.stack);
      })
  }

  spa(req, res) {
    const instance = this;
    instance.spaRender(req, res);
  }

  spaRender(req, res, customMetaKeywords, customMetaDescription, customTitle) {
    const xBundleUri = util.format('/bin/player.%s.bundle.js', ('string' == typeof req.query.lang ? req.query.lang : 'zh_cn'));
    const paramDict = {
      title: ('string' == typeof customTitle ? customTitle : ""),
      metaKeywords: ('string' == typeof customMetaKeywords ? customMetaKeywords : ""),
      metaDescription: ('string' == typeof customMetaDescription ? customMetaDescription : ""),
      xBundleUri: constants.ROUTE_PATHS.BASE + xBundleUri,
    };
    res.render('index', paramDict);
  }
}

module.exports = PlayerRouterCollection;
