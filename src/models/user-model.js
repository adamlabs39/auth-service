import { DataTypes, Model } from "sequelize";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import fieldTime from "./base-model.js";
import { uuidv7 } from "uuidv7";

export default class UserModel extends Model {}
UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      defaultValue: uuidv7()
    },
    faskesUuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    roleUuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    token: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    iventoryMedis: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: false,
    },
    iventoryNonMedis: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: false,
    },
    ...fieldTime
  },
  {
    sequelize: sequlizeInstance,
    tableName: "users",
    underscored: true,
    timestamps: false
  }
);
