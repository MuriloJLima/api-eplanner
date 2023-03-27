const Sequelize = require('sequelize');

const connection = require('../database/database');

const usuarios = require('./usuarios')

const orcamentos = connection.define(
  'orcamentos',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    valor: {
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

orcamentos.belongsTo(usuarios, {
  foreignKey: 'usuarioId',
  onUpdate:'cascade',
  onDelete:'cascade'
})

usuarios.hasOne(orcamentos, {
  foreignKey: 'usuarioId',
  onUpdate:'cascade',
  onDelete:'cascade'
})


//orcamentos.sync()

module.exports = orcamentos