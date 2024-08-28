import { Op } from "sequelize";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import UserModel from "../models/user-model.js";
import { RoleModel, UserActionModel } from "../models/model-synchronize.js";

export default class AuthenticationRepository {
  
  static async findUser(username) {
    UserModel.hasOne(UserActionModel, {
      foreignKey: "userUuid",
      sourceKey: "uuid",
      constraints: false
    });
    UserActionModel.belongsTo(UserModel, {
      foreignKey: "uuid",
      targetKey: "roleUuid",
      constraints: false
    });
    UserModel.hasOne(RoleModel, {
      foreignKey: "uuid",
      sourceKey: "roleUuid",
      constraints: false
    });
    RoleModel.belongsTo(UserModel, {
      foreignKey: "uuid",
      targetKey: "roleUuid",
      constraints: false
    });
    return await sequlizeInstance.transaction(async tr => {
      let userXUserAction = await UserModel.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { username },
                {
                  email: username
                }
              ]
            },
            {
              deletedAt: {
                [Op.is]: null
              }
            }
          ]
        },
        attributes: ["uuid", ["faskes_uuid", "faskesUuid"], "username", "name", "email", "phone", ["role_uuid", "roleUuid"], "password"],
        transaction: tr,
        include: [
          {
            model: UserActionModel,
            required: true,
            attributes: ["actionCode"],
          },
          {
            model: RoleModel,
            required: true,
            attributes: ["name"]
          }
        ]
      });
      if(userXUserAction) {
        userXUserAction = {...userXUserAction.toJSON(), actionCode: userXUserAction.UserActionModel.actionCode, role: userXUserAction.RoleModel.name };
        delete userXUserAction.RoleModel;
        delete userXUserAction.UserActionModel;
        return userXUserAction;
      }
    });
  }

  static async updateToken(uuid, token){
    const reuslt = await sequlizeInstance.transaction(async tr => {
      const user = await UserModel.update({token}, {
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
        returning: ["uuid", "username", "name", "email", "phone", "role_uuid"]
      });
      return user[1][0];
    });
    return reuslt;
  }

  static async deleteToken(username){
    return sequlizeInstance.transaction(async tr => {
      const user = await UserModel.update({token: null}, {
        where: {
          [Op.and]: [
            { username },
            {
              deletedAt: {
                [Op.is]: null
              }
            }
          ]
        },
        transaction: tr
      });
      return Number(user[0].toPrecision());
    })
  }

  static async isTokenExist(username){
    return await UserModel.findOne({
      where: {
        [Op.and]: [
          { username },
          {
            token: {
              [Op.not]: null
            }
          }
        ]
      }
    })
  }
}
