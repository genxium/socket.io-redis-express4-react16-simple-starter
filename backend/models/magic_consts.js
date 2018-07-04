const baseAbsPath = __dirname + '/';

const Sequelize = require('sequelize');

const logger = require('../utils/Logger').instance.getLogger();
const SQLiteManager = require('../utils/SQLiteManager');

const MagicConsts = SQLiteManager.instance.dbRef.define('magic_consts', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  key: {
    type: Sequelize.STRING
  },
  val: {
    type: Sequelize.STRING
  },
}, {
  tableName: 'magic_consts',
  timestamps: false
});

module.exports = MagicConsts;
