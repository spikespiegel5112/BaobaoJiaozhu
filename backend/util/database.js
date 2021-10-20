const Sequelize = require('sequelize');

const sequelize = new Sequelize('sq_voting', 'sq_voting', 'I9R7C9F1', {
  dialect: 'mysql',
  host: 'mysql.sql168.cdncenter.net',
  timezone: '+08:00'
});

module.exports = sequelize;
