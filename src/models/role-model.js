import { DataTypes, Model } from "sequelize";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import defaultTimesatamp from "./common/default-timestamp.js";
import { defaultHook } from "./common/default-hook.js";
import defaultIdentifier from "./common/default-identifier.js";

export default class RoleModel extends Model {}
RoleModel.init(
  {
    ...defaultIdentifier,
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ...defaultTimesatamp
  },
  {
    sequelize: sequlizeInstance,
    tableName: "roles",
    underscored: true,
    timestamps: false,
    hooks: {...defaultHook }
  }
);
