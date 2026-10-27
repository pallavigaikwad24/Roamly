'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoginAuthModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LoginAuthModel.belongsTo(models.User, {
        foreignKey: 'user_id'
      });

    }
  }
  LoginAuthModel.init({
    user_id: DataTypes.INTEGER,
    failed_attempts: DataTypes.INTEGER,
    lock_until: DataTypes.DATE,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'LoginAuthModel',
  });
  return LoginAuthModel;
};