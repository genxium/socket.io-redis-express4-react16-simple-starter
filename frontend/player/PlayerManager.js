const singleton = Symbol();
const singletonEnforcer = Symbol();

import constants from '../../common/constants';
import AbstractRoleLoginManager from '../AbstractRoleLoginManager';

class PlayerManager extends AbstractRoleLoginManager {
  constructor(enforcer) {
    if (enforcer != singletonEnforcer)
      throw "Cannot construct singleton";
    super();
    this.logoutEndpoint = constants.ROUTE_PATHS.BASE + constants.ROUTE_PATHS.PLAYER + constants.ROUTE_PATHS.API_V1 + constants.ROUTE_PATHS.LOGOUT;
    this.storageKey = "/loggedIn/player";
    this.roleLoginScenePathname = constants.ROUTE_PATHS.PAGE + constants.ROUTE_PATHS.INT_AUTH_TOKEN + constants.ROUTE_PATHS.LOGIN;
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new PlayerManager(singletonEnforcer);
    }
    return this[singleton];
  }
}

module.exports = PlayerManager;
