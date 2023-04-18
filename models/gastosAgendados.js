const Sequelize = require('sequelize');

const connection = require('../database/database');

const categorias = require('./categorias')

const gastosAgendados = connection.define(
  'gastosAgendados',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    descricao: {
      allowNull: false,
      type: Sequelize.STRING
    },
    valor: {
      type: Sequelize.DECIMAL
    },
    dataGasto: {
      type: Sequelize.DATE
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

categorias.hasMany(gastosAgendados, {
  foreignKey: 'categoriaId',
  onUpdate:'cascade',
  onDelete:'cascade'
})

gastosAgendados.belongsTo(categorias, { foreignKey: 'categoriaId' });


//gastosAgendados.sync()

module.exports = gastosAgendados