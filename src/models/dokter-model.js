import { DataTypes, Model } from "sequelize";
import fieldTime from "./base-model.js";
import sequlizeInstance from "../configurations/sequelize-configuration.js";

export default class DokterModel extends Model {}
DokterModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    uuid: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    faskesUuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    bpjsCode: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    antrianCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    sip: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    kuotaJkn: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    kuotaNonJkn: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    time_pelayanan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    durasiPelayanan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lokasiUuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ...fieldTime,
  },
  {
    sequelize: sequlizeInstance,
    tableName: "dokters",
    underscored: true,
    timestamps: false
  }
);
