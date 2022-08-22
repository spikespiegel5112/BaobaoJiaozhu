const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const VotingOptions = sequelize.define(
  'VotingOptions',
  {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    votingId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.STRING,
      allowNull: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    value: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = VotingOptions;
