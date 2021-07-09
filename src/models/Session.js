const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
exports.model = (sequelize) =>
  sequelize.define(
    'Session',
    {
      token: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      expires: DataTypes.DATE,
      user_id: DataTypes.INTEGER,
    },
    {
      tableName: 'sessions',
      timestamps: false,
      underscored: true,
    }
  );

/**
 * @param {import('sequelize').Sequelize['models']} models
 */
exports.relationships = ({ Session, User }) => {
  Session.belongsTo(User);
};
