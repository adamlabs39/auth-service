import { Op, where } from "sequelize";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import UserModel from "../models/user-model.js";

export default class AuthenticationRepository {
  
  static async findUser(username) {
    const user = await UserModel.findOne({
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
      attributes: ["uuid", "username", "name", "email", "phone", ["role_uuid", "roleUuid"], "password"]
    });
    return user.get();
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
