'use strict';

const {AirportModel} = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const airportInfo = [
      { name: "Los Angeles International Airport", icao_code: "KLAX", city: "Los Angeles", country: "United States", timezone: "America/Los_Angeles", createdAt: new Date(), updatedAt: new Date() },
      { name: "Heathrow Airport", icao_code: "EGLL", city: "London", country: "United Kingdom", timezone: "Europe/London", createdAt: new Date(), updatedAt: new Date() },
      { name: "Dubai International Airport", icao_code: "OMDB", city: "Dubai", country: "United Arab Emirates", timezone: "Asia/Dubai", createdAt: new Date(), updatedAt: new Date() },
      { name: "Tokyo Haneda Airport", icao_code: "RJTT", city: "Tokyo", country: "Japan", timezone: "Asia/Tokyo", createdAt: new Date(), updatedAt: new Date() },
      { name: "Sydney Kingsford Smith Airport", icao_code: "YSSY", city: "Sydney", country: "Australia", timezone: "Australia/Sydney", createdAt: new Date(), updatedAt: new Date() },
      { name: "Toronto Pearson International Airport", icao_code: "CYYZ", city: "Toronto", country: "Canada", timezone: "America/Toronto", createdAt: new Date(), updatedAt: new Date() },
      { name: "Beijing Capital International Airport", icao_code: "ZBAA", city: "Beijing", country: "China", timezone: "Asia/Shanghai", createdAt: new Date(), updatedAt: new Date() },
      { name: "Charles de Gaulle Airport", icao_code: "LFPG", city: "Paris", country: "France", timezone: "Europe/Paris", createdAt: new Date(), updatedAt: new Date() },
      { name: "Indira Gandhi International Airport", icao_code: "VIDP", city: "New Delhi", country: "India", timezone: "Asia/Kolkata", createdAt: new Date(), updatedAt: new Date() },
      { name: "São Paulo/Guarulhos International Airport", icao_code: "SBGR", city: "São Paulo", country: "Brazil", timezone: "America/Sao_Paulo", createdAt: new Date(), updatedAt: new Date() },
      { name: "Frankfurt Airport", icao_code: "EDDF", city: "Frankfurt", country: "Germany", timezone: "Europe/Berlin", createdAt: new Date(), updatedAt: new Date() },
      { name: "Hong Kong International Airport", icao_code: "VHHH", city: "Hong Kong", country: "China", timezone: "Asia/Hong_Kong", createdAt: new Date(), updatedAt: new Date() },
      { name: "John F. Kennedy International Airport", icao_code: "KJFK", city: "New York", country: "United States", timezone: "America/New_York", createdAt: new Date(), updatedAt: new Date() },
      { name: "Amsterdam Schiphol Airport", icao_code: "EHAM", city: "Amsterdam", country: "Netherlands", timezone: "Europe/Amsterdam", createdAt: new Date(), updatedAt: new Date() },
      { name: "Madrid Barajas Airport", icao_code: "LEMD", city: "Madrid", country: "Spain", timezone: "Europe/Madrid", createdAt: new Date(), updatedAt: new Date() },
      { name: "Kuala Lumpur International Airport", icao_code: "WMKK", city: "Kuala Lumpur", country: "Malaysia", timezone: "Asia/Kuala_Lumpur", createdAt: new Date(), updatedAt: new Date() },
      { name: "Singapore Changi Airport", icao_code: "WSSS", city: "Singapore", country: "Singapore", timezone: "Asia/Singapore", createdAt: new Date(), updatedAt: new Date() },
      { name: "Mexico City International Airport", icao_code: "MMMX", city: "Mexico City", country: "Mexico", timezone: "America/Mexico_City", createdAt: new Date(), updatedAt: new Date() },
      { name: "Denver International Airport", icao_code: "KDEN", city: "Denver", country: "United States", timezone: "America/Denver", createdAt: new Date(), updatedAt: new Date() },
      { name: "Istanbul Airport", icao_code: "LTFM", city: "Istanbul", country: "Turkey", timezone: "Europe/Istanbul", createdAt: new Date(), updatedAt: new Date() },
    ]

    for (const airport of airportInfo) {
      await AirportModel.findOrCreate({
        where: { icao_code: airport.icao_code }, // Check if exists
        defaults: {
          name: airport.name,
          city: airport.city,
          country: airport.country,
          timezone: airport.timezone,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('AirportModels', null);
  }
};
