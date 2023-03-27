const Sequelize = require('sequelize');

const connection = require('../database/database');

const orcamentos = require('./orcamentos')

const categorias = connection.define(
  'categorias',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    nome: {
      type: Sequelize.STRING
    },
    descricao: {
      type: Sequelize.STRING
    },
    valorCompleto: {
      type: Sequelize.DECIMAL
    },
    valorDisponivel: {
      type: Sequelize.DECIMAL
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }
)

orcamentos.hasMany(categorias, {
  foreignKey: 'orcamentoId',
  onUpdate:'cascade',
  onDelete:'cascade'
})

categorias.belongsTo(orcamentos, {
  foreignKey: 'orcamentoId',
  onUpdate:'cascade',
  onDelete:'cascade'
})



//categorias.sync()

module.exports = categorias