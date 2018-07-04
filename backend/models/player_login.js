const baseAbsPath = __dirname + '/';

const Sequelize = require('sequelize');

const logger = require('../utils/Logger').instance.getLogger();
const MYSQLManager = require('../utils/MySQLManager');

const PlayerLogin = MYSQLManager.instance.dbRef.define('player_login', {
  int_auth_token: {
    type: Sequelize.STRING
  },
  player_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  from_public_ip: {
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
  tableName: 'player_login',
  timestamps: false
});

module.exports = PlayerLogin;
