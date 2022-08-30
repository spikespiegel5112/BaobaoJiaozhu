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
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    fileUrlLeftSide: {
      type: Sequelize.STRING,
      allowNull: true
    },
    fileUrlRightSide: {
      type: Sequelize.STRING,
      allowNull: true
    },
    fileUrl: {
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
    destPath: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = FileDownloader;
