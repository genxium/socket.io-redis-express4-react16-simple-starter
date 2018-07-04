const express = require('express');
const constants = require('../../common/constants');

class AbstractAuthRouterCollection {
  constructor(props) {
    const instance = this;
    this.onLoggedInByCredentialsRouter = express.Router({
      mergeParams: true
    });

    this.onLoggedInByCredentialsRouter.get(constants.ROUTE_PATHS.LOGIN, function(req, res) {
      (instance.onLoggedInByCredentials.bind(instance))(req, res);
    });

    this.onLoggedInByCredentialsRouter.post(constants.ROUTE_PATHS.LOGIN, function(req, res) {
      (instance.onLoggedInByCredentials.bind(instance))(req, res);
    });

    this.onLoggedInBySmsCaptchaRouter = express.Router({
      mergeParams: true
    });

    this.onLoggedInBySmsCaptchaRouter.post(constants.ROUTE_PATHS.LOGIN, function(req, res) {
      (instance.onLoggedInBySmsCaptcha.bind(instance))(req, res);
    });

    // Auth middlewares begin.
    // NOTE: Ref binding is required in children classes.
    this.credentialsAuth = null;
    this.tokenAuth = null;
    this.smsCaptchaAuth = null;
    // Auth middlewares end.

    this.pageRouter = null;
    this.authProtectedApiRouter = null;
  }

  tokenExpired(res) {
    return res.json({
      ret: constants.RET_CODE.TOKEN_EXPIRED,
    });
  }

  nonexistentHandle(res) {
    return res.json({
      ret: constants.RET_CODE.NONEXISTENT_HANDLE,
    });
  }

  incorrectPassword(res) {
    return res.json({
      ret: constants.RET_CODE.INCORRECT_PASSWORD,
    });
  }

  incorrectCaptcha(res) {
    return res.json({
      ret: constants.RET_CODE.INCORRECT_CAPTCHA,
    });
  }

  incorrectPhone(res) {
    return res.json({
      ret: constants.RET_CODE.INCORRECT_PHONE_COUNTRY_CODE_OR_NUMBER,
    });
  }

  notImplemented(res) {
    return res.json({
      ret: constants.RET_CODE.NOT_IMPLEMENTED_YET,
    });
  }

  respondWithError(res, err) {
    const retCode = ( (undefined === err || null === err || undefined === err.ret || null === err.ret) ? constants.RET_CODE.FAILURE : err.ret );
    res.json({
      ret: retCode,
    });
  }
}

module.exports = AbstractAuthRouterCollection;
