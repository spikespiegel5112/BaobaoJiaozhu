const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Fans = sequelize.define(
  'Fans',
  {
    id: {
      type: Sequelize.STRING,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true
    },
    nickName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isExpire: {
      type: Sequelize.STRING,
      allowNull: true
    },
    expireDate: {
      type: Sequelize.DATE,
      allowNull: true
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
