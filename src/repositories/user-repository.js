import { Op } from "sequelize";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import UserModel from "../models/user-model.js";
import { toEpochDate } from "../helpers/date-helper.js";
import RoleModel from "../models/role-model.js";
import { UserActionModel } from "../models/model-synchronize.js";

export default class UserRepository {
  static async create(userReq) {
    const result = await sequlizeInstance.transaction(async tr => {
      const user = await UserModel.create(userReq, { transaction: tr });
      const { uuid: userUuid } = user.toJSON();
      const { actionCode } = userReq;
      const userAction = await UserActionModel.create({ userUuid, actionCode }, { 
        transaction: tr,
        returning: ["id", "user_action", "action_code"]
       });
      return {
        userUuid: user.toJSON().uuid,
        userAction: userAction.toJSON().actionCode
      }
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
        return await UserModel.count({
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
          transaction: tr
        });
    });
    return total;
  }

  static async findAll(page, limit, sortBy, role){
    UserModel.hasOne(RoleModel, {
      foreignKey: "uuid",
      sourceKey: "roleUuid",
      constraints: false
    });
    RoleModel.belongsTo(UserModel, {
      foreignKey: "uuid",
      targetKey: "roleUuid",
      constraints: false
    })
    return await sequlizeInstance.transaction(async tr => {
      let user = await UserModel.findAll({
        where: {
          deletedAt: {
            [Op.is]: null
          }
        },
        transaction: tr,
        attributes: ["uuid", ["role_uuid", "roleUuid"], "name", "username", "email", "phone", ["created_at", "createdAt"], ["updated_at", "updatedAt"], ["faskes_uuid", "faskesUuid"], "status"],
        limit,
        offset: page,
        order: [
          ["uuid", sortBy]
        ],
        include: [
          {
            model: RoleModel,
            required: true,
            attributes: ["name"],
            where: role
          }
        ],
      });
      if(user.length > 0) return user.map(usr => {
        const role = usr.RoleModel.name;
        const { uuid, name, username, email, phone, createdAt, updatedAt, deletedAt, status, faskesUuid } = usr;
        return {uuid, name, username, email, phone, createdAt, updatedAt, deletedAt, status, faskesUuid, role};
      })
      else return []
    });
  }

  static async findByUuid(uuid){
    return await sequlizeInstance.transaction(async tr => {
      const user =  await UserModel.findOne({
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
        attributes: ["uuid", ["role_uuid", "roleUuid"], "name", "username", "email", "phone", ["created_at", "createdAt"], ["updated_at", "updatedAt"]]
      });
      return user;
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
      return await UserModel.findAll({
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
      return afectedRow[0];
    });
    return result;
  }

  static async findByUuidIncludeRole(uuid){
    return await sequlizeInstance.transaction(async tr => {
      const user = await UserModel.findOne({
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
        attributes: ["name", "email"],
        transaction: tr,
        include: [
          {
            required: true,
            attributes: ["name", "code"],
            association: UserModel.belongsTo(RoleModel, {
              foreignKey: "roleUuid",
              targetKey: "uuid",
              as: "role"
            })
          }
        ]
      })
      return user;
    })
  }
}
