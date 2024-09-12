import { DataTypes, Model } from "sequelize";
import defaultTimesatamp from "./common/default-timestamp.js";
import { uuidv7 } from "uuidv7";
import { sequelizeInstance } from "@adameds-engineer/model-sdk";

export default class FaskesModel extends Model {}
FaskesModel.init(
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
      unique: true,
      defaultValue: () => uuidv7(),
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    ...defaultTimesatamp,
  },
  {
    timestamps: false,
    tableName: "faskes",
    sequelize: sequelizeInstance,
    underscored: true,
  }
);
