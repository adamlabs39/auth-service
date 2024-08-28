import { DataTypes, Model } from "sequelize";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import defaultTimesatamp from "./common/default-timestamp.js";
import { defaultHook } from "./common/default-hook.js";
import defaultIdentifier from "./common/default-identifier.js";

export default class UserModel extends Model {}
UserModel.init(
  {
    ...defaultIdentifier,
    roleUuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    doctor_uuid: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    nakesUuid: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: false,
    },
    inventoryMedis: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: false,
    },
    inventoryNonMedis: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: false,
    },
    ...defaultTimesatamp,
  },
  {
    sequelize: sequlizeInstance,
    tableName: "users",
    underscored: true,
    timestamps: false,
    hooks: {...defaultHook }
  }
);


