const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: Sequelize.STRING,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: true
    },
    loginName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.STRING,
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = User;
