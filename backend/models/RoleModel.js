const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    code: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = Role;
