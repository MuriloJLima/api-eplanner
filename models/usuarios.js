const Sequelize = require('sequelize');

const connection = require('../database/database');

const usuarios = connection.define(
  'usuarios',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    nome: {
      allowNull: false,
      type: Sequelize.STRING
      
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true
    },
    senha: {
      allowNull: false,
      type: Sequelize.STRING
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


//usuarios.sync()

module.exports = usuarios