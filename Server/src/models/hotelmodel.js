'use strict';
const {
  Model
} = require('sequelize');
const { requiredErrorMessage } = require('../services/staticMessage');
module.exports = (sequelize, DataTypes) => {
  class HotelModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HotelModel.hasMany(models.HotelBookingModel, {
        foreignKey: 'hotel_id'
      });

      HotelModel.belongsTo(models.User, {
        foreignKey: 'owner_id'
      });

      HotelModel.hasMany(models.ReviewHotelModel, { foreignKey: 'hotel_id' })
    }
  }
  HotelModel.init({
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: '[/defaultImg/image.png]'
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price_per_night: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    available_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    services: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    is_verified:{
      type: DataTypes.BOOLEAN
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: 'HotelModel',
  });
  return HotelModel;
};