'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HotelModels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      owner_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.TEXT
      },
      images: {
        type: Sequelize.JSON
      },
      country: {
        type: Sequelize.TEXT
      },
      price_per_night: {
        type: Sequelize.DOUBLE
      },
      available_rooms: {
        type: Sequelize.INTEGER
      },
      services: {
        type: Sequelize.JSON
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_deleted: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HotelModels');
  }
};