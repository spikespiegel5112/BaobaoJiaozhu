const Sequelize = require('sequelize');

const sequelize = new Sequelize('jiaozhu', 'jiaozhu', '123456', {
  dialect: 'mysql',
  host: 'antisony.org',
  timezone: '+08:00'
});

module.exports = sequelize;
