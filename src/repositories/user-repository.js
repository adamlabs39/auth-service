import { Op } from "sequelize";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import UserModel from "../models/user-model.js";
import { toEpochDate } from "../helpers/date-helper.js";

export default class UserRepository {
  static async create(userReq) {
    const result = await sequlizeInstance.transaction(async tr => {
        const user = await UserModel.create(userReq, {
          transaction: tr,
        });
        return user;
    });
    return result;
  }

  static async update(userUpdate){
    const user = await sequlizeInstance.transaction(async tr => {
      try{
        const user = await UserModel.update(userUpdate, {
          where: { uuid: userUpdate.uuid },
          transaction: tr,
        });
        return user[0];
      }catch(error){
        throw error;
      }
    });
    return user;
  }

  static async countUserByUuid(uuid) {
    const total = await sequlizeInstance.transaction(async tr => {
      try{
        return await UserModel.count({
        where: { uuid },
          transaction: tr
        });
      }catch(error){
        throw error;
      }
    });
    return Number(total);
  }

  static async findAll(){
    return await sequlizeInstance.transaction(async tr => {
      return await UserModel.findAll({
        where: {
          deletedAt: {
            [Op.is]: null
          }
        },
        transaction: tr,
        attributes: ["uuid", ["role_uuid", "roleUuid"], "name", "username", "email", "phone", ["created_at", "createdAt"], ["updated_at", "updatedAt"]]
      });
    })
  }

  static async findByUuid(uuid){
    return await sequlizeInstance.transaction(async tr => {
      const user =  await UserModel.findOne({
        where: {uuid},
        transaction: tr,
        attributes: ["uuid", ["role_uuid", "roleUuid"], "name", "username", "email", "phone", ["created_at", "createdAt"], ["updated_at", "updatedAt"]]
      });
      return user.get();
    });
  }

  static async findByUsername(username) {
    try{
      const result = await sequlizeInstance.transaction(async tr => {
        return await UserModel.findOne({
          where: { username },
          transaction: tr,
          attributes: ["uuid", ["role_uuid", "roleUuid"], "name", "username", "email", "phone", ["created_at", "createdAt"], ["updated_at", "updatedAt"]]
        });
      });
      return result.get();
    }catch(error){
      throw error;
    }
  }

  static async findAllDeleted() {
    const result = await sequlizeInstance.transaction(async tr => {
      return await UserModel.findOne({
        where: { 
          deletedAt: {
            [Op.not]: null
          }
        },
        transaction: tr,
        attributes: ["uuid", ["role_uuid", "roleUuid"], "name", "username", "email", "phone", ["created_at", "createdAt"], ["updated_at", "updatedAt"]]
      });
    });
    return result;
  }

  static async updatePassword(password, uuid){
    const result = await sequlizeInstance.transaction(async tr => {
      const afectedRow = await UserModel.update({password}, {
        where: {
          [Op.and]: [
            {uuid},
            {
              deletedAt: {
                [Op.is]: null
              }
            }
          ]
        },
        transaction: tr,
        returning: ["username"]
      });
      return afectedRow[1][0];
    });
    return result;
  }

  static async delete(uuid){
    const result = await sequlizeInstance.transaction(async tr => {
      const afectedRow = await UserModel.update({deletedAt: toEpochDate(new Date())}, {
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
        returning: ["username"]
      });
      return Number(afectedRow[1][0]);
    });
    return result;
  }
}
