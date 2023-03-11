'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GastoRealizado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GastoRealizado.belongsTo(models.Categoria)
    }
  }
  GastoRealizado.init({
    valor: DataTypes.DECIMAL,
    dataGasto: DataTypes.DATE,
    categoriaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GastoRealizado',
  });
  return GastoRealizado;
};