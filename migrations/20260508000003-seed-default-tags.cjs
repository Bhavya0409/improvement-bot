'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tags', [
      {
        value: 'bot',
        displayValue: 'Bot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: 'buy',
        displayValue: 'Buy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: 'plan',
        displayValue: 'Plan',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tags', {
      value: ['bot', 'buy', 'plan'],
    });
  }
};

