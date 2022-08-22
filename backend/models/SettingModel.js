const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Setting = sequelize.define(
  'Setting',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true
    },
    settingId: {
      type: Sequelize.STRING,
      allowNull: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = Setting;
