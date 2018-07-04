'use strict';

const IS_DEVELOPMENT = (undefined == process.env.NODE_ENV || null == process.env.NODE_ENV || '' == process.env.NODE_ENV || 'development' == process.env.NODE_ENV);
exports.IS_DEVELOPMENT = IS_DEVELOPMENT;

const IS_TESTING = (IS_DEVELOPMENT && "true" == process.env.TESTING);
exports.IS_TESTING = IS_TESTING;

const IS_STRESS_TESTING = (IS_TESTING && "true" == process.env.STRESS_TESTING);
exports.IS_STRESS_TESTING = IS_STRESS_TESTING;

const NOT_IN_PRODUCTION = ('production' != process.env.NODE_ENV);
exports.NOT_IN_PRODUCTION = NOT_IN_PRODUCTION;

const REGEX = {
  PHONE: /^\+?[0-9]{8,14}$/,
  PASSWORD: /^.{6,50}$/,

  KEYWORD: /^[^\n\t]{2,20}$/,
};

exports.REGEX = REGEX;

// TODO: Groom the following "RET_CODE" to be consistent with the product into which will be embedded. 

// The following `RET_CODE` list temporarily correspond to `<proj-root>/backend/routers/AbstractAuthRouterCollection`.
exports.RET_CODE = {
  OK: 1000,
  FAILURE: 1001,

  TOKEN_EXPIRED: 2003,
  NONEXISTENT_HANDLE: 2005,
  INCORRECT_PASSWORD: 2006,
  INCORRECT_CAPTCHA: 2007,
  INCORRECT_PHONE_COUNTRY_CODE_OR_NUMBER: 2011,

  INSUFFICIENT_MEM_TO_ALLOCATE_CONNECTION: 3001,
  CAPTCHA_GENERATION_PER_PHONE_TOO_FREQUENTLY: 4001,

  NOT_IMPLEMENTED_YET: 65535,
};

const ROUTE_PATHS = {
  ROOT: "/",
  BASE: "",

  TEST: "/test",

  PLAYER: "/player",

  API_V1: "/v1",
  PAGE: "/page",

  INT_AUTH_TOKEN: "/intAuthToken",
  LOGIN: "/login",
  LOGOUT: "/logout",

  LIST: "/list",

  RET_CODE: "/retCode",
  REGEX: "/regex"
};

exports.ROUTE_PATHS = ROUTE_PATHS;

const ROUTE_PARAMS = {
  API_VER: "/v:version",
};

exports.ROUTE_PARAMS = ROUTE_PARAMS;
