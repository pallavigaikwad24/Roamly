'use strict';
const {
  Model
} = require('sequelize');
const { validErrorMessage, requiredErrorMessage } = require('../services/staticMessage');
module.exports = (sequelize, DataTypes) => {
  class FlightBookingModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      FlightBookingModel.belongsTo(models.User, {
        foreignKey: 'user_id'
      });

      FlightBookingModel.belongsTo(models.FlightModel, {
        foreignKey: 'flight_id'
      });

    }
  }
  FlightBookingModel.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    flight_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    number_of_seats: {
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
    modelName: 'FlightBookingModel',
  });
  return FlightBookingModel;
};