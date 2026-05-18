'use strict';

const {TAGS} = require("../utils/constants.js");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tags', [
			{
				value: TAGS.ARCHIVE,
				displayValue: 'Archive',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
      {
        value: TAGS.BOT,
        displayValue: 'Bot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: TAGS.BUY,
        displayValue: 'Buy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
			{
				value: TAGS.CAR,
				displayValue: 'Car',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
      {
        value: TAGS.PLAN,
        displayValue: 'Plan',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tags', {
      value: [TAGS.BOT, TAGS.CAR, TAGS.BUY, TAGS.PLAN, TAGS.ARCHIVE],
    });
  }
};

