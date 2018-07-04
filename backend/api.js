const baseAbsPath = __dirname + '/';

const Logger = require(baseAbsPath + "utils/Logger");
const logger = Logger.instance.getLogger();
const util = require('util');
const crypto = require('crypto');
const cors = require('cors');
const constants = require(baseAbsPath + '../common/constants');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const redisAdapter = require('socket.io-redis');
const MySQLManager = require('./utils/MySQLManager');
const SQLiteManager = require('./utils/SQLiteManager');
const MagicConstsManager = require('./utils/MagicConstsManager');

const yaml = require('js-yaml');
const fs = require('fs');

/*
* Initialization of `socket.io-server` under a `worker-process` launched & managed by `pm2`. 
*/
const io = require('socket.io')(http, {
  path: '/sio',
  pingInterval: 2000,
  pingTimeout: 2000
});

const redisConfig = yaml.safeLoad(fs.readFileSync(baseAbsPath + './configs/' + (constants.IS_TESTING ? 'redis.conf' : 'redis.test.conf'), 'utf8'));
io.adapter(redisAdapter({ host: redisConfig.host, port: redisConfig.port }));

const corsOptions = {
  origin: function(origin, callback) {
    // Temporarily allowing all CORS access.
    callback(null, true)
  }
};
app.use(cors(corsOptions));

const compress = require('compression');
app.use(compress()); 

const favicon = require('serve-favicon');
const path = require('path');

app.use(favicon(path.join(__dirname, 'static', 'icon', 'favicon.ico')))

// Mount static resource entry, reference http://expressjs.com/en/api.html
app.use(constants.ROUTE_PATHS.BASE + '/bin', express.static(baseAbsPath + '../frontend/bin'));
app.use(constants.ROUTE_PATHS.BASE + constants.ROUTE_PATHS.ICON, express.static(baseAbsPath + 'static/icon'));
app.use(constants.ROUTE_PATHS.BASE + '/static', express.static(baseAbsPath + 'static'));

// Body parser middleware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Pug template. Reference http://expressjs.com/en/guide/using-template-engines.html
app.set('view engine', 'pug');
app.set('views', baseAbsPath + './pugs');

/*------------------------*/

/**
 * @apiGroup Constants 
 * @api {get} /retCode/v:version/list RetCodeList 
 *
 * @apiSuccess {Object} N/A A single-level retCode dictionary.
 *
 */
app.get(constants.ROUTE_PATHS.BASE + constants.ROUTE_PATHS.RET_CODE + constants.ROUTE_PARAMS.API_VER + constants.ROUTE_PATHS.LIST, function(req, res) {
  const toLogMsg = constants.ROUTE_PATHS.BASE + constants.ROUTE_PATHS.RET_CODE + constants.ROUTE_PARAMS.API_VER + constants.ROUTE_PATHS.LIST;
  logger.info(toLogMsg);
  res.json(constants.RET_CODE);
});

/**
 * @apiGroup Constants 
 * @api {get} /regex/v:version/list RegexList 
 *
 * @apiSuccess {Object} N/A A single-level regex dictionary.
 *
 */
app.get(constants.ROUTE_PATHS.BASE + constants.ROUTE_PATHS.REGEX + constants.ROUTE_PARAMS.API_VER + constants.ROUTE_PATHS.LIST, function(req, res) {
  const toLogMsg = constants.ROUTE_PATHS.BASE + constants.ROUTE_PATHS.REGEX + constants.ROUTE_PARAMS.API_VER + constants.ROUTE_PATHS.LIST;
  logger.info(toLogMsg);
  let toRet = {};
  for (let k in constants.REGEX) {
    toRet[k] = constants.REGEX[k].toString();
  }
  res.json(toRet);
});

logger.info("[ONGOING] Connects to MySQL server %s.", MySQLManager.instance.locationAndIdentity);
MySQLManager.instance.testConnectionAsync()
.then(() => {
  logger.info("[COMPLETE] Connects to MySQL server %s.", MySQLManager.instance.locationAndIdentity);
  logger.info("[ONGOING] Reads preconfigured SQLite data %s.", SQLiteManager.instance.locationAndIdentity);
  return SQLiteManager.instance.testConnectionAsync();
})
.then(() => {
  logger.info("[COMPLETE] Reads preconfigured SQLite data %s.", SQLiteManager.instance.locationAndIdentity);
  logger.info("[ONGOING] Initializes MagicConstsManager.instance.magicConsts.");
  return MagicConstsManager.instance.initMagicConstsAsync();
})
.then(() => {
  logger.info("[COMPLETE] Initializes MagicConstsManager.instance.magicConsts.");

  const PlayerRouterCollection = require('./routers/player');
  const playerRouterCollection = new PlayerRouterCollection();

  //---Player router begins.---
  
  // Player pages.
  app.use(constants.ROUTE_PATHS.BASE + constants.ROUTE_PATHS.PLAYER + constants.ROUTE_PATHS.PAGE,
    playerRouterCollection.pageRouter);

  // Player non-page apis.
  app.use(constants.ROUTE_PATHS.BASE + constants.ROUTE_PATHS.PLAYER + constants.ROUTE_PARAMS.API_VER,
    playerRouterCollection.tokenAuth,
    playerRouterCollection.authProtectedApiRouter);

  //---Player router ends.---

  const port = 9099;
  http.listen(port, function() {

    //--- Initialization of socket.io-server + socket.io-redis begins.---
    const randomEleFromArray = (arr) => {
      const buf = Buffer.from(crypto.randomBytes(4));
      const idx = (buf.readUInt32LE() % arr.length);
      return arr[idx];
    };

    const findPlayer = (wsSessionHandshake) => {
      // TODO: Make a genuine authentication.
      const playerId = wsSessionHandshake.query.playerId;
      return {
        id: playerId
      };
    };

    const theAdapter = io.of('/').adapter; 
    io.use((wsSession, next) => {
      const player = findPlayer(wsSession.handshake);
      if (!player) return next(new Error("Authentication error"));
      wsSession.player = player;
      return next();
    });

    io.on('connect', (wsSession) => {
      const playerId = wsSession.player.id;
      const roomid = parseInt(wsSession.handshake.query.roomid);
      logger.info(util.format("PlayerId == %s is requesting to join roomid == %s via pid == %s.", playerId, roomid, process.pid));

      theAdapter.remoteJoin(wsSession.id, roomid, (err) => {
        if (err) { 
          logger.error(err);
          return;
        }
        logger.info(util.format("PlayerId == %s has joined roomid == %s via pid == %s.", playerId, roomid, process.pid));
      });

     wsSession.on("message", (msg) => {
        logger.debug(`Received message ${JSON.stringify(msg)} from a wsSession of playerId == ${playerId} managed by pid == ${process.pid}.`);
        const toEchoMsg = {
          fromPlayerId: playerId,
          toPlayerId: playerId,
        };
        wsSession.emit('unicastedFrame', toEchoMsg);
      });

      wsSession.on('disconnect', (reason) => {
        // There's no need to invoke `theAdapter.remoteLeave` for each joined `roomid` manually.
        logger.info(util.format("PlayerId == %s has left roomid == %s via pid == %s.", playerId, roomid, process.pid));
      });
    });
    //--- Initialization of socket.io-server + socket.io-redis ends.---

    try {
      logger.info('Api service listening on port ' + port + '. ');
    } catch (err) {
      logger.error(err.stack);
    }
  });
});

process.on('uncaughtException', (err) => {
  logger.error(err.stack);
});
