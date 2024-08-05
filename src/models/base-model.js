import { DataTypes } from "sequelize";

const fieldTime = {
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: false,
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
