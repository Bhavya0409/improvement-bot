'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
		await queryInterface.addColumn('improvements', 'completedAt', {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: null,
		});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
		await queryInterface.removeColumn('improvements', 'completedAt');
  }
};
