const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
exports.model = (sequelize) =>
  sequelize.define(
    'Role',
    {
      name: DataTypes.STRING,
    },
    {
      tableName: 'roles',
      timestamps: false,
      underscored: true,
    }
  );
