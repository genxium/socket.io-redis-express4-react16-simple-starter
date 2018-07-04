const baseAbsPath = __dirname + '/';

const Logger = require(baseAbsPath + "../utils/Logger");
const logger = Logger.instance.getLogger(__filename);

const child_process = require('child_process');
const util = require('util');
const Promise = require('bluebird');

let childProcesses = [];

let playerIdRoomidPairs = [[7, 9], [8, 9], [1, 19], [2, 18], [1, 18], [2, 19], [2, 18], [1, 18], [2, 19]];

logger.info(util.format("About to launch %s child-processes.", playerIdRoomidPairs.length));

Promise.reduce(playerIdRoomidPairs, function(total, pair) {
  logger.info(util.format("About to launch with params (%s %s).", pair[0], pair[1]));
  const cmd = util.format('node');
  const cpCmdArgs = [baseAbsPath + "./test_client_ws_conn.js", pair[0], pair[1]];
  const cp = child_process.spawn(cmd, cpCmdArgs, {
    stdio: 'inherit'
  }); 
  logger.info(util.format("Started child process pid == %s.", cp.pid));
  childProcesses.push(cp);
  return ++total;
}, 0)
  .then(function(total) {
  logger.info(util.format("All child-processes launched."));
});


function handleExit(signalOrCode) {
  logger.info(`Received signal or code ${signalOrCode}`);
  for (let cp of childProcesses) {
    logger.warn(util.format("Killing child process pid == %s.", cp.pid));
    cp.kill();
  }
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('exit', handleExit);
