const baseAbsPath = __dirname + '/';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const Logger = require(baseAbsPath + "utils/Logger");
const logger = Logger.instance.getLogger();

// Mount static resource entry, reference http://expressjs.com/en/api.html
app.use(express.static('docs'));

const port = 9999;
http.listen(port, function() {
  logger.info('Apidocs service listening on port ' + port);
});
