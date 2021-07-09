const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
exports.model = (sequelize) =>
  sequelize.define(
    'Config',
    {
      board_jobs_count: DataTypes.INTEGER,
      jobs_per_page: DataTypes.INTEGER,
    },
    {
      tableName: 'config',
      underscored: true,
    }
  );
