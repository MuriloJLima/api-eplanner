'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Categoria.belongsTo(models.Orcamento)
      Categoria.hasMany(models.GastoRealizado)
      Categoria.hasMany(models.GastoAgendado)
    }
  }
  Categoria.init({
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    valor: DataTypes.DECIMAL,
    orcamentoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Categoria',
  });
  return Categoria;
};