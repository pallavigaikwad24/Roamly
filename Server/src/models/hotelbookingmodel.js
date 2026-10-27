'use strict';
const {
  Model
} = require('sequelize');
const { requiredErrorMessage, validErrorMessage, existErrorMessage } = require('../services/staticMessage');
module.exports = (sequelize, DataTypes) => {
  class HotelBookingModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HotelBookingModel.belongsTo(models.HotelModel, {
        foreignKey: 'hotel_id'
      });

      HotelBookingModel.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
    }
  }
  HotelBookingModel.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    check_in_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    check_out_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    number_of_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    booking_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'HotelBookingModel',
  });
  return HotelBookingModel;
};