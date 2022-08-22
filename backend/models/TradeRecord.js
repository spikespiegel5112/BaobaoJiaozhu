const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const TradeRecord = sequelize.define(
  'TradeRecord',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true
    },
    tradeTime: {
      type: Sequelize.STRING,
      allowNull: true
    },
    market: {
      type: Sequelize.STRING,
      allowNull: true
    },
    tradeType: {
      type: Sequelize.STRING,
      allowNull: true
    },
    price: {
      type: Sequelize.STRING,
      allowNull: true
    },
    quntity: {
      type: Sequelize.STRING,
      allowNull: true
    },
    price: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = TradeRecord;
