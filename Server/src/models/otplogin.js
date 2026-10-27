'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OtpLogin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      OtpLogin.belongsTo(models.User, { foreignKey: 'user_id' })
    }
  }
  OtpLogin.init({
    user_id: DataTypes.INTEGER,
    otp: DataTypes.INTEGER,
    is_valid: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'OtpLogin',
  });
  return OtpLogin;
};