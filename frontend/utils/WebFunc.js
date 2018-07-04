'use strict';

import NetworkFunc from '../../common/NetworkFunc';
import constants from '../../common/constants';

class WebFunc {

  static setCookie(key, val, path, days) {
    if (!path) var path = "/";
    var expires = null;
    if (!(!days)) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    } else
      expires = "";
    document.cookie = key + "=" + val + expires + "; path=" + path;
  }

  static getCookie(key) {
    if (document.cookie.length <= 0) return null;
    var end;
    var start = document.cookie.indexOf(key + "=");
    var isValid = (start == 0 || document.cookie[start - 1] == ' ' || document.cookie[start - 1] == ';');
    while (!isValid) {
      if (start == -1) return null;
      start = document.cookie.indexOf(key + "=", start + 1);
      isValid = (start == 0 || document.cookie[start - 1] == ' ' || document.cookie[start - 1] == ';');
    }
    start = start + key.length + 1;
    end = document.cookie.indexOf(";", start);
    if (end == -1)
      end = document.cookie.length;
    return unescape(document.cookie.substring(start, end));
  }

  static setCookieWithPreURIEncoding(key, val, path, days) {
    var encodedVal = encodeURIComponent(val);
    WebFunc.setCookie(key, encodedVal, path, days);
  }

  static getCookieWithPostURIDecoding(key) {
    var encodedVal = WebFunc.getCookie(key);
    return decodeURIComponent(encodedVal);
  }

  static removeCookie(key) {
    WebFunc.setCookie(key, "", "/", -1);
  }

  static encodeStateWithAction(sceneRef, cbname, cbparams) {
    const pathname = sceneRef.props.location.pathname;
    let dict = {
      p: pathname
    };
    if (undefined !== cbname && null !== cbname) {
      dict = Object.assign({
        cbn: cbname
      }, dict);
    }
    if (undefined != cbparams && null !== cbparams) {
      dict = Object.assign({
        cbp: cbparams
      }, dict);
    }
    return encodeURIComponent(JSON.stringify(dict));
  }

  static decodeStateWithAction(encodedStr) {
    const decodedStr = decodeURIComponent(encodedStr);
    try {
      return JSON.parse(decodedStr);
    } catch (e) {
      // the string returned by wechat comes without double quotes
      throw e;
    }
  }

  static storeVolatileCallback(key, cbname, cbparams) {
    if (undefined === cbname || null === cbname) return false;
    let volatileCallback = {
      cbn: cbname
    };
    if (undefined !== cbparams && null !== cbparams) {
      Object.assign(volatileCallback, {
        cbp: cbparams
      });
    }
    localStorage.setItem(key, JSON.stringify(volatileCallback));
    return true;
  }

  static extractVolatileCallback(key) {
    const valStr = localStorage.getItem(key);
    if (null === valStr || undefined === valStr) return null;
    localStorage.removeItem(key);
    return JSON.parse(valStr);
  }

  static storeSceneState(sceneRef, extraParamDict, keyDictToExclude) {
    const key = sceneRef.props.location.pathname;
    let val = null;
    if (extraParamDict === null || extraParamDict === undefined) {
      val = sceneRef.state;
    } else {
      val = Object.assign(sceneRef.state, extraParamDict);
    }
    for (let key in keyDictToExclude) {
      delete val[key];
    }
    localStorage.setItem(key, JSON.stringify(val));
  }

  static extractSceneState(sceneRef) {
    const key = sceneRef.props.location.pathname;
    const valStr = localStorage.getItem(key);
    if (null === valStr || undefined === valStr) return null;
    localStorage.removeItem(key);
    return JSON.parse(valStr);
  }
}

module.exports = WebFunc;
