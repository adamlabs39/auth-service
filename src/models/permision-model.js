import { DataTypes, Model } from "sequelize";
import fieldTime from "./base-model.js";
import { sequlizeInstance } from "./model-synchronize.js";

export default class PermisionModel extends Model {}
PermisionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    faskesUuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    category: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: false,
    },
    mainMenuCode: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: false
    },
    mainMenuName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: false
    },
    mainMenu: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: false
    },
    subMenuCode: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: false
    },
    subMenuName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: false
    },
    ...fieldTime,
  },
  {
    sequelize: sequlizeInstance,
    tableName: "permisions",
    underscored: true,
    timestamps: false
  }
);
