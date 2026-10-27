'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FlightModels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      flight_number: {
        type: Sequelize.TEXT
      },
      airline: {
        type: Sequelize.TEXT
      },
      departure_airport: {
        type: Sequelize.TEXT
      },
      departure_date: {
        type: Sequelize.DATEONLY
      },
      departure_time: {
        type: Sequelize.TIME
      },
      arrival_airport: {
        type: Sequelize.TEXT
      },
      arrival_date: {
        type: Sequelize.DATEONLY
      },
      arrival_time: {
        type: Sequelize.TIME
      },
      price: {
        type: Sequelize.DOUBLE
      },
      seats_available: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('FlightModels');
  }
};