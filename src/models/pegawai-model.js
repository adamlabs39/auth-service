import { DataTypes, Model } from "sequelize";
import { sequlizeInstance } from "./model-synchronize.js";

export default class PegawaiModel extends Model {}

PegawaiModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize: sequlizeInstance,
    tableName: "pegawai",
    underscored: true,
    timestamps: false
  }
);
