import { DataTypes, Model } from "sequelize";
import { sequlizeInstance } from "./model-synchronize.js";
import defaultTimesatamp from "./common/default-timestamp.js";
import { defaultHook } from "./common/default-hook.js";
import defaultIdentifier from "./common/default-identifier.js";


export default class PermisionModel extends Model {}
PermisionModel.init(
  {
    ...defaultIdentifier,
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
    ...defaultTimesatamp,
  },
  {
    sequelize: sequlizeInstance,
    tableName: "permisions",
    underscored: true,
    timestamps: false,
    hooks: {...defaultHook }
  }
);
