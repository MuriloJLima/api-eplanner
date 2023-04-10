const Sequelize = require('sequelize');

const connection = require('../database/database');

const categorias = require('./categorias')

const gastosRealizados = connection.define(
  'gastosRealizados',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    descricao: {
      type: Sequelize.STRING
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
    }
  }
)

categorias.hasMany(gastosRealizados, {
  foreignKey: 'categoriaId',
  onUpdate:'cascade',
  onDelete:'cascade'
})

gastosRealizados.belongsTo(categorias, {
  foreignKey: 'categoriaId',
  onUpdate:'cascade',
  onDelete:'cascade'
})

//gastosRealizados.sync({force: true})

module.exports = gastosRealizados