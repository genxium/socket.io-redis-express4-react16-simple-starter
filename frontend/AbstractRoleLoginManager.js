import WebFunc from './utils/WebFunc';
import NetworkFunc from '../common/NetworkFunc';
import constants from '../common/constants';

class AbstractRoleLoginManager {
  constructor(props) {
    this.storage = localStorage;
    this.loggedInRole = null;
    this._wsRef = null;
  }

  checkWhetherTokenHasExpiredAsync(sceneRef, responseData) {
    const instance = this;
    if (undefined === responseData || null === responseData || responseData.ret != constants.RET_CODE.TOKEN_EXPIRED) {
      return new Promise(function(resolve, reject) {
        resolve(false);
      });
    }
    return instance.logoutAsync(sceneRef);
  }

  replaceRoleLoginScene(sceneRef, cbname, cbparams) {
    const instance = this;
    const encodedStateWithAction = WebFunc.encodeStateWithAction(sceneRef, cbname, cbparams);
    const paramDict = {
      encodedStateWithAction: encodedStateWithAction,
    };
    sceneRef.props.replaceNewScene(sceneRef, instance.roleLoginScenePathname, paramDict);
  }

  loginByCookieTokenAsync(sceneRef) {
    const instance = this;
    return new Promise(function(resolve, reject) {
      const cookieToken = WebFunc.getCookie(constants.PLAYER_TOKEN_CACHE_NSP);
      if (!cookieToken) {
        resolve(false);
        return;
      }
      const paramDict = {
        token: cookieToken
      };
      NetworkFunc.post(instance.loginByCookieTokenEndpoint, paramDict)
        .then(function(response) {
          return response.json();
        })
        .then(function(responseData) {
          if (constants.RET_CODE.OK != responseData.ret) {
            instance.removeLoggedInRole();
            resolve(false);
            return;
          }
          const loggedInRole = Object.assign({
            token: cookieToken
          }, responseData.role);
          WebFunc.removeCookie(constants.PLAYER_TOKEN_CACHE_NSP);
          instance.saveLoggedInRole(loggedInRole);
          resolve(true);
        });
    });
  }

  logoutAsync(sceneRef) {
    const instance = this;
    return new Promise(function(resolve, reject) {
      if (!instance.hasLoggedIn()) {
        resolve(true);
        return;
      }

      let paramDict = {
        token: instance.loggedInRole.intAuthToken,
      };
      NetworkFunc.post(instance.logoutEndpoint, paramDict)
        .then(function(response) {
          try {
            if (constants.HTTP_STATUS_CODE.UNAUTHORIZED = response.status) {
              return new Promise(function(resolve, reject) {
                resolve(null);
              });
            } else return response.json();
          } catch (err) {
            return new Promise(function(resolve, reject) {
              resolve(null);
            });
          }
        })
        .then(function(responseData) {
          instance.removeLoggedInRole();
          if (instance._wsRef && instance._wsRef.connected) {
            instance._wsRef.disconnect(true);
          // TODO: Fix reconnection issues, reference https://github.com/socketio/socket.io-client/issues/251.
          }
          resolve(true);
        });
    });
  }

  saveLoggedInRole(loggedInRole) {
    const instance = this;
    instance.loggedInRole = {
      intAuthToken: loggedInRole.intAuthToken,
      expiresAt: loggedInRole.expiresAt,
      id: loggedInRole.id
    };
    instance.storage.setItem(instance.storageKey, JSON.stringify(instance.loggedInRole));
  }

  loadLoggedInRoleAsync(sceneRef) {
    const instance = this;
    return new Promise(function(resolve, reject) {
      instance.loggedInRole = JSON.parse(instance.storage.getItem(instance.storageKey));
      if (instance.loggedInRole !== null) {
        if (Number(instance.loggedInRole.expiresAt) < NetworkFunc.currentSecs()) {
          instance.removeLoggedInRole();
        }
      }
      resolve();
    });
  }

  removeLoggedInRole() {
    const instance = this;
    instance.loggedInRole = null;
    WebFunc.removeCookie(constants.PLAYER_TOKEN_CACHE_NSP);
    instance.storage.removeItem(instance.storageKey);
  }

  hasLoggedIn() {
    const instance = this;
    return (undefined !== instance.loggedInRole && null !== instance.loggedInRole);
  }
}

module.exports = AbstractRoleLoginManager;
