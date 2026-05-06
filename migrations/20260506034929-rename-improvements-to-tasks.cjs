'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Rename table from 'improvements' to 'tasks'
    await queryInterface.renameTable('improvements', 'tasks');
    
    // Add lastCompletedAt column
    await queryInterface.addColumn('tasks', 'lastCompletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove lastCompletedAt column
    await queryInterface.removeColumn('tasks', 'lastCompletedAt');
    
    // Rename table back to 'improvements'
    await queryInterface.renameTable('tasks', 'improvements');
  }
};
