import { DataTypes, Model } from "sequelize";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import defaultTimesatamp from "./common/default-timestamp.js";
import { defaultHook } from "./common/default-hook.js";
import defaultIdentifier from "./common/default-identifier.js";

export default class DokterModel extends Model {}
DokterModel.init(
  {
    ...defaultIdentifier,
    roleUuid: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    ...defaultTimesatamp,
  },
  {
    sequelize: sequlizeInstance,
    tableName: "dokters",
    underscored: true,
    timestamps: false,
    hooks: { ...defaultHook },
  }
);
