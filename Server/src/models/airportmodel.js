'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AirportModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AirportModel.init({
    name: DataTypes.STRING,
    icao_code: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    timezone: DataTypes.STRING,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'AirportModel',
  });
  return AirportModel;
};