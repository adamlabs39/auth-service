import { DataTypes, Model } from "sequelize";
import defaultTimesatamp from "./common/default-timestamp.js";
import { defaultHook } from "./common/default-hook.js";
import defaultIdentifier from "./common/default-identifier.js";
import { sequelizeInstance } from "@adameds-engineer/model-sdk";

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
    sequelize: sequelizeInstance,
    tableName: "roles",
    underscored: true,
    timestamps: false,
    hooks: {...defaultHook }
  }
);
