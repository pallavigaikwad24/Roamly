'use strict';
const {
  Model
} = require('sequelize');
const { requiredErrorMessage } = require('../services/staticMessage');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.HotelBookingModel, {
        foreignKey: 'user_id'
      });

      User.hasMany(models.HotelModel, {
        foreignKey: "owner_id"
      });

      User.hasMany(models.FlightBookingModel, {
        foreignKey: 'user_id'
      });

      User.hasMany(models.FlightModel, {
        foreignKey: "owner_id"
      });

      User.hasOne(models.LoginAuthModel, {
        foreignKey: 'user_id'
      });

      User.hasOne(models.OtpLogin, { foreignKey: 'user_id' });

      User.hasMany(models.ReviewHotelModel, { foreignKey: 'user_id' })
    }
  }
  User.init({
    first_name: DataTypes.TEXT,
    last_name: DataTypes.TEXT,
    email: DataTypes.TEXT,
    password: DataTypes.TEXT,
    country: DataTypes.TEXT,
    phone_number: DataTypes.TEXT,
    user_type: DataTypes.TEXT,
    is_verified: DataTypes.BOOLEAN,
    is_deleted: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};