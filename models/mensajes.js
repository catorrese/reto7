const { DataTypes, Model } = require("sequelize");
const sequelize = require("../lib/sequelize");

class Mensaje extends Model {}

Mensaje.init(
  {
    mensaje: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Mensaje",
  }
);

Mensaje.sync();

module.exports = Mensaje;