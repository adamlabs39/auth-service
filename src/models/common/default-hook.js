import { uuidv7 } from "uuidv7";
import { toEpochDate } from "../../helpers/date-helper.js";

export const defaultHook = {
  beforeCreate: (instance) => {    
    instance.dataValues.uuid = uuidv7();
    instance.dataValues.createdAt = toEpochDate(new Date());
  },
  beforeUpdate: (instance) => {
    instance.dataValues.updatedAt = toEpochDate(new Date());
  },
  beforeDestroy: (instance) => {
    instance.dataValues.deletedAt = toEpochDate(new Date());
  },
};