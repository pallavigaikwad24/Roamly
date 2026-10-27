'use strict';
const {
  Model
} = require('sequelize');
const { requiredErrorMessage, validErrorMessage } = require('../services/staticMessage');
module.exports = (sequelize, DataTypes) => {
  class FlightModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      FlightModel.hasMany(models.FlightBookingModel, {
        foreignKey: 'flight_id'
      });

      FlightModel.belongsTo(models.User, {
        foreignKey: 'owner_id'
      });
    }
  }
  FlightModel.init({
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    flight_number: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    airline: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    departure_airport: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    departure_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    departure_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    arrival_airport: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    arrival_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    arrival_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: { msg: requiredErrorMessage("Price") },
        isNumeric: { msg: validErrorMessage("Price") }
      }
    },
    seats_available: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: requiredErrorMessage("Seats Availablity") },
        isNumeric: { msg: validErrorMessage("Seats Availability") }
      }
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'FlightModel',
  });
  return FlightModel;
};