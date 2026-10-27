'use strict';
const bcrypt = require("bcrypt");
const isSuperAdminExist = require("../utils/isSuperAdminExist");

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

    const result = await isSuperAdminExist('gaikwadpallavi263@gmail.com', 'superAdmin');
    if (result) {
      await queryInterface.bulkInsert('Users', [{
        first_name: 'Pallavi',
        last_name: 'Gaikwad',
        email: 'gaikwadpallavi263@gmail.com',
        password: bcrypt.hashSync("Pallavi@123", 10),
        country: 'India',
        user_type: 'superAdmin',
        phone_number: 8790654321,
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Users', { email: 'gaikwadpallavi263@gmail.com' }, {})

  }
};
