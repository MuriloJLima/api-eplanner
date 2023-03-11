'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orcamento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Orcamento.belongsTo(models.Usuario)
      Orcamento.hasMany(models.Categoria)
    }
  }
  Orcamento.init({
    valor: DataTypes.DECIMAL,
    usuarioId: DataTypes.INTEGER,
    categoriaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Orcamento',
  });
  return Orcamento;
};