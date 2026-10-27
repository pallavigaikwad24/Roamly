'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewHotelModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReviewHotelModel.belongsTo(models.User, { foreignKey: 'user_id' });
      ReviewHotelModel.belongsTo(models.HotelModel, { foreignKey: 'hotel_id' });
    }
  }
  ReviewHotelModel.init({
    user_id: DataTypes.INTEGER,
    hotel_id: DataTypes.INTEGER,
    reviewText: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'ReviewHotelModel',
  });
  return ReviewHotelModel;
};