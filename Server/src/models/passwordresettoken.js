'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PasswordResetToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PasswordResetToken.init({
    user_id: DataTypes.INTEGER,
    token: DataTypes.TEXT,
    expireToken: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PasswordResetToken',
  });
  return PasswordResetToken;
};