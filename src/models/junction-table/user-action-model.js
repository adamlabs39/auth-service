import { DataTypes, Model } from "sequelize";
import sequlizeInstance from "../../configurations/sequelize-configuration.js";

export default class UserActionModel extends Model {}
UserActionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    userUuid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    actionCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    }
  },
  {
    sequelize: sequlizeInstance,
    tableName: "user_action",
    underscored: true,
    timestamps: false
  }
);
