const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Log = sequelize.define(
  'Log',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: true,
      primaryKey: true
    },
    crawlerType: {
      type: Sequelize.STRING,
      allowNull: true
    },
    crawlerDate: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = Log;
