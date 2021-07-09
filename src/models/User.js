const { DataTypes } = require('sequelize');
const { hash, genSalt, hashSync, genSaltSync } = require('bcrypt');

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
exports.model = (sequelize) =>
  sequelize.define(
    'User',
    {
      username: { type: DataTypes.STRING, unique: true },
      password: {
        type: DataTypes.STRING,
        set(value) {
          this.set('password', hashSync(value, genSaltSync()), {
            raw: true,
          });
        },
      },
      email: { type: DataTypes.STRING, unique: true },
      address: DataTypes.STRING,
      gender: DataTypes.STRING,
      phone: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,

      // relationships
      role_id: DataTypes.INTEGER,
    },
    {
      tableName: 'users',
      timestamps: false,
      underscored: true,
    }
  );
