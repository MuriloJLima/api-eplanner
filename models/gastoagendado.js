'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GastoAgendado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GastoAgendado.belongsTo(models.Categoria)
    }
  }
  GastoAgendado.init({
    valor: DataTypes.DECIMAL,
    dataGasto: DataTypes.DATE,
    categoriaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GastoAgendado',
  });
  return GastoAgendado;
};