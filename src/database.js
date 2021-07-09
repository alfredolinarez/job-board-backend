const { Sequelize } = require('sequelize');

module.exports = new Sequelize({
  dialect: 'mysql',
  username: 'root',
  password: 'welc0me',
  host: 'localhost',
  database: 'job_board',
});
