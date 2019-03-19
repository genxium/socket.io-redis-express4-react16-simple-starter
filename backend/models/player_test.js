const baseAbsPath = __dirname + '/';

const Sequelize = require('sequelize');

const logger = require('../utils/Logger').instance.getLogger();
const SQLiteManager = require('../utils/SQLiteManager');

const PlayerTest = SQLiteManager.instance.dbRef.define('player_test', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  raw_password: {
    type: Sequelize.STRING
  },
  unique_name: {
    type: Sequelize.STRING
  },
  created_at: {
    type: Sequelize.INTEGER
  },
  updated_at: {
    type: Sequelize.INTEGER
  },
  deleted_at: {
    type: Sequelize.INTEGER
  }

}, {
  tableName: 'player_test',
  timestamps: false
});

module.exports = PlayerTest;
