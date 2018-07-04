'use strict';

const moment = require('moment');
const constants = require('./constants');

class NetworkFunc {
  static generateApiUrlPrefix(url) {
    const r = /(https?:\/\/)?(^(?!\/)[^\/^:^?]+)?([^:^?]+)/;
    const match = r.exec(url);
    if (null === match || undefined === match) return null;
    return (
      constants.IS_TESTING 
      ? 
      (window.location.protocol + "//" + (match[2] ? match[2] : window.location.host) + match[3])
      : 
      (window.location.protocol + "//" + "api-" + (match[2] ? match[2] : window.location.host) + match[3])); 
  }

  static isEmpty(str) {
    return (undefined === str || null === str || "" == str || "null" == str);
  }

  static isNumber(str) {
    if (Number(str) == 0) return true;
    return (Number(str));
  }

  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static guid() {
    const s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  static shortCode(nsegs) {
    const s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    let nsegsInt = parseInt(nsegs);
    let effectiveNsegs = ((isNaN(nsegsInt) || 1 >= nsegsInt) ? 1 : nsegsInt);
    let ret = "";
    while (effectiveNsegs--) {
      ret += s4();
    }
    return ret;
  }

  // NOTE: Time utils begins.
  static startOfCurrentWeekMillis() {
    return 1000 * moment().startOf('week').unix();
  }

  static currentMillis() {
    const currentMomentObj = moment();
    return 1000 * currentMomentObj.unix() + currentMomentObj.milliseconds();
  }

  static currentSecs() {
    const currentMomentObj = moment();
    return currentMomentObj.unix();
  }

  static currentMomentObj() {
    return moment();
  }

  static gmtMiilisecToLocalYmdhis(millis) {
    return moment(millis).format("YYYY-MM-DD HH:mm:ss");
  }

  static gmtMiilisecToLocalYmdhi(millis) {
    return moment(millis).format("YYYY-MM-DD HH:mm");
  }

  static gmtMiilisecToLocalYmd(millis) {
    return moment(millis).format("YYYY-MM-DD");
  }

  static localYmdhisToGmtMillisec(dateStr) {
    return 1000 * moment(dateStr, "YYYY-MM-DD HH:mm:ss").unix();
  }

  static localYmdToGmtMillisec(dateStr) {
    return 1000 * moment(dateStr, "YYYY-MM-DD").unix();
  }

  static momentObjToGmtMillis(obj) {
    return 1000 * obj.unix();
  }
  static momentObjToGmtSecs(obj) {
    return obj.unix();
  }

  static momentObjToLocalYmd(obj) {
    return obj.format("YYYY-MM-DD");
  }

  static separateHisValuesToHisStr(hours, minutes, seconds) {
    function pad(num, size) {
      var s = num.toString();
      while (s.length < size) s = "0" + s;
      return s;
    }
    return pad(hours, 2) + " : " + pad(minutes, 2) + " : " + pad(seconds, 2);
  }

  static gmtMillisToMomentObj(millis) {
    return moment(millis);
  }

  static gmtMillisOfYmdStart(dateStr) {
    return 1000 * moment(dateStr + " 00:00:00", "").unix();
  }

  static gmtMillisOfYmdLastSecond(dateStr) {
    return 1000 * moment(dateStr + " 23:59:59", "").unix();
  }

  static beginningOfDayMomentObjTranslate(obj) {
    obj.hour(0);
    obj.minute(0);
    obj.second(0);
    obj.millisecond(0);
    return obj;
  }

  static lastSecOfDayMomentObjTranslate(obj) {
    obj.hour(23);
    obj.minute(59);
    obj.second(59);
    obj.millisecond(0);
    return obj;
  }

  static durationToTargetMillisFromNow(millis) {
    const targetMomentObj = moment(millis);
    const currentMomentObj = moment();
    const tDiff = targetMomentObj.diff(currentMomentObj);
    const tDuration = moment.duration(tDiff);
    return {
      days: tDuration.days(),
      hours: tDuration.hours(),
      minutes: tDuration.minutes(),
      seconds: tDuration.seconds(),
      millis: tDuration.milliseconds(),
    };
  }

  static oneDayEarlierMomentObj(obj) {
    obj.subtract(1, 'days');
    return obj;
  }

  // NOTE: Time utils ends.
  static strReplaceInOrder(str, args) {
    return str.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match;
    });
  }

  static mapToSortedQueryParams(map) {
    let keys = Object.keys(map);
    keys.sort();
    let paramList = [];
    for (let idx = 0; idx < keys.length; ++idx) {
      const k = keys[idx];
      const v = map[k];
      paramList.push(k + "=" + encodeURIComponent(v));
    }
    return paramList.join('&');
  }

  // The `fetch` polyfill API requires explicit specification of basic-auth or other cookie associated communication, reference https://github.com/github/fetch#sending-cookies.
  static get(url, paramsDict) {
    const processedUrl = NetworkFunc.generateApiUrlPrefix(url);

    if (!paramsDict || Object.keys(paramsDict).length == 0) {
        return fetch(processedUrl, {
        credentials: 'same-origin',
      });
    }
    const concatenated = processedUrl + "?" + NetworkFunc.mapToSortedQueryParams(paramsDict);
    return fetch(concatenated, {
      credentials: 'same-origin',
    });
  }

  static post(url, paramsDict) {
    const processedUrl = NetworkFunc.generateApiUrlPrefix(url);
    return (
    fetch(processedUrl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: NetworkFunc.mapToSortedQueryParams(paramsDict)
    })
    );
  }

  static postJson(url, paramsDict) {
    const processedUrl = NetworkFunc.generateApiUrlPrefix(url);
    return (
    fetch(processedUrl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(paramsDict)
    })
    );
  }

  static isValueInDictionary(v, dict) {
    for (let k in dict) {
      if (dict[k] != v) continue;
      return true;
    }
    return false;
  }
}

module.exports = NetworkFunc;
