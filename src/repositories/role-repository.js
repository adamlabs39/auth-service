import { Op } from "sequelize";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import RoleModel from "../models/role-model.js";
import { toEpochDate } from "../helpers/date-helper.js";

export default class RoleRepository {
  static async create(roleReq) {
    return await sequlizeInstance.transaction(async tr => {
      return await RoleModel.create(roleReq, {transaction: tr});
    })
  }
  

  static async update(updateReq) {
    try {
      const result = await sequlizeInstance.transaction(async (tr) => {
        const role = await RoleModel.update(updateReq, {
          where: {
            [Op.and]: [
              {uuid: updateReq.uuid},
              {
                deletedAt: {
                  [Op.is]: null
                }
              }
            ],
          },
          transaction: tr,
        });
        return role[0];
      });
      return result;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  static async countByName(name) {
    try {
      const quantity = await RoleModel.count({
        where: { name },
      });
      return Number(quantity.toPrecision());
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param { uuid } uuid
   * @returns
   */
  static async findByUuid(uuid) {
    const result = await sequlizeInstance.transaction(async (tr) => {
      try {
        return await RoleModel.findOne({
          where: { 
            [Op.and]: [
              { uuid },
              { 
                deletedAt: {
                  [Op.is]: null
                }
              }
            ]
           },
          attributes: ["uuid", "code", "name", "createdAt", "updatedAt"],
          transaction: tr,
        });
      } catch (error) {
        throw error;
      }
    });
    return result;
  }

  static async deleteByUuid(uuid) {
    const result = await sequlizeInstance.transaction(async tr => {
      const role = await RoleModel.update({deletedAt: toEpochDate(new Date())}, {
        where: { 
          [Op.and]: [
            { uuid },
            {
              deletedAt: {
                [Op.is]: null
              }
            }
          ]
        },
        transaction: tr,
      });
      return role[0];
    });
    return result;
  }

  static async findAll(){
    const result = await sequlizeInstance.transaction(async tr => {
      return await RoleModel.findAll({
        where: {
          deletedAt: {
            [Op.is]: null
          }
        },
        transaction: tr,
        attributes: ["uuid", "code", "name", "createdAt", "updatedAt"]
      })
    })
    return result
  }

  static async findByName(name){
    return sequlizeInstance.transaction(async tr => {
      const role = await RoleModel.findOne({
        where: {
          [Op.and]: [
            { name },
            {
              deletedAt: {
                [Op.is]: null
              }
            }
          ]
        },
        transaction: tr
      });
      return role;
    })
  }
}
