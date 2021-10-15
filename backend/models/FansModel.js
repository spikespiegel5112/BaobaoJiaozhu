const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Fans = sequelize.define(
  'Fans',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = Fans;
