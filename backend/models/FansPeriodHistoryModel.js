const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const FansPeriodHistory = sequelize.define(
  'FansPeriodHistory',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true
    },
    fanId: {
      type: Sequelize.STRING,
      allowNull: true
    },
    period: {
      type: Sequelize.STRING,
      allowNull: true
    },
    expireDate: {
      type: Sequelize.DATE,
      allowNull: true
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = FansPeriodHistory;
