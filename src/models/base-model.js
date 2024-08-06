import { DataTypes } from "sequelize";
import { toEpochDate } from "../helpers/date-helper.js";

const fieldTime = {
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: false,
    defaultValue: toEpochDate(new Date())
  },
  updatedAt: {
    type: DataTypes.BIGINT,
    allowNull: true,
    unique: false,
  },
  deletedAt: {
    type: DataTypes.BIGINT,
    allowNull: true,
    unique: false,
  },
};

export default fieldTime;
