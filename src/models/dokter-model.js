import { DataTypes, Model } from "sequelize";
import fieldTime from "./base-model.js";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import { uuidv7 } from "uuidv7";

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
      defaultValue: uuidv7(),
      unique: true,
    },
    faskesUuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    roleUuid: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: uuidv7()
    },
    bpjsCode: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    queueCode: {
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
    serviceTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serviceDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    locationUuid: {
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
