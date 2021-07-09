const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
exports.model = (sequelize) =>
  sequelize.define(
    'Category',
    {
      name: DataTypes.STRING,
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      tableName: 'categories',
      timestamps: false,
      underscored: true,
    }
  );
