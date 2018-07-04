const baseAbsPath = __dirname + '/';

const Sequelize = require('sequelize');

const Logger = require('../utils/Logger');
const SQLiteManager = require('../utils/SQLiteManager');

const PlayerTest = SQLiteManager.instance.dbRef.define('player_test', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  display_name: {
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
  },
  sign: {
    type: Sequelize.STRING
  }
},
  {
    tableName: 'player_test',
    timestamps: false
  });

module.exports = PlayerTest;
