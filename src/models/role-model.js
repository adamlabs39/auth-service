import { DataTypes, Model } from "sequelize";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import fieldTime from "./base-model.js";

export default class RoleModel extends Model {}
RoleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    faskesUuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    permisionUuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    ...fieldTime
  },
  {
    sequelize: sequlizeInstance,
    tableName: "roles",
    underscored: true,
    timestamps: false
  }
);
