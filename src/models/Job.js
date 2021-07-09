const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
exports.model = (sequelize) =>
  sequelize.define(
    'Job',
    {
      company: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      how_to_apply: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
      },
      logo: DataTypes.TEXT,
      url: DataTypes.STRING,

      /**
       * Possible status:
       * - open
       * - closed
       */
      status: DataTypes.STRING,

      // relationships
      category_id: DataTypes.INTEGER,
      publisher_id: DataTypes.INTEGER,
    },
    {
      tableName: 'jobs',
      underscored: true,
      timestamps: false,
    }
  );
