import { Op } from "sequelize";
import { toEpochDate } from "../helpers/date-helper.js";
import RoleModel from "../models/role-model.js";
import { UserModel, sequelizeInstance } from "@adameds-engineer/model-sdk";

export default class UserRepository {
  static async create(user) {
    return await sequelizeInstance.transaction(async tr => {
      return await UserModel.create(user, 
        { 
          transaction: tr,
          returning: true
        });
    });
  }

  static async update(user){
    return sequelizeInstance.transaction(async tr => {
      const { uuid } = user;
      const userUpdate = await UserModel.update(user, {
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
      return userUpdate[0]
    })
  }

  static async countUserByUuid(uuid) {
    return await sequelizeInstance.transaction(async tr => {
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
    return await sequelizeInstance.transaction(async tr => {
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
    return await sequelizeInstance.transaction(async tr => {
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
      const result = await sequelizeInstance.transaction(async tr => {
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
    const result = await sequelizeInstance.transaction(async tr => {
      return await UserModel.findAll({
        where: { 
          deletedAt: {
            [Op.not]: null
          }
        },
        transaction: tr,
        attributes: ["uuid", ["role_uuid", "roleUuid"], "name", "username", "email", "phone", ["created_at", "createdAt"], ["updated_at", "updatedAt"], ["deleted_at", "deletedAt"]]
      });
    });
    return result !== null ? result.map(userDeleted => userDeleted.toJSON()) : result;
  }

  static async updatePassword(password, uuid){
    return await sequelizeInstance.transaction(async tr => {
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
  }

  static async delete(uuid){
    const result = await sequelizeInstance.transaction(async tr => {
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
    return await sequelizeInstance.transaction(async tr => {
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
            })
          }
        ]
      })
      return user;
    })
  }
}
