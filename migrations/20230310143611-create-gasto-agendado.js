'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GastoAgendados', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      descricao:{
        allowNull: false,
        type: Sequelize.STRING
      },
      valor: {
        type: Sequelize.DECIMAL
      },
      dataGasto: {
        type: Sequelize.DATE
      },
      categoriaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categorias',
          key: 'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade'
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
    await queryInterface.dropTable('GastoAgendados');
  }
};