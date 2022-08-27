const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const FileDownloader = sequelize.define(
  'FileDownloader',
  {
    id: {
      type: Sequelize.STRING,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true
    },
    fileNameLeftSide: {
      type: Sequelize.STRING,
      allowNull: true
    },
    fileNameRightSide: {
      type: Sequelize.STRING,
      allowNull: true
    },
    seriesNumberStart: {
      type: Sequelize.STRING,
      allowNull: true
    },
    seriesNumberEnd: {
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

module.exports = FileDownloader;
