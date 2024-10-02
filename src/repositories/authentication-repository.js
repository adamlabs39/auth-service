import { Op } from "sequelize";
import { RoleModel, UserModel } from "model-sdk/datamaster";
import sequelizeInstance from "model-sdk/instance";

export default class AuthenticationRepository {
  
  static async findUser(username) {
    return await sequelizeInstance.transaction(async tr => {
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
      const user = await UserModel.findOne({
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
        attributes: ["uuid", ["faskes_uuid", "faskesUuid"], "username", "name", "email", "phone", ["role_uuid", "roleUuid"], "password", "permissions"],
        transaction: tr,
        include: [
          {
            model: RoleModel,
            required: true,
            attributes: ["name"]
          }
        ]
      });
      if(user) {
        const userResp = user.toJSON();
        userResp.role = userResp.RoleModel.name;
        delete userResp.RoleModel;
        delete userResp.roleUuid;
        return userResp;
      }
    });
  }

  static async updateToken(uuid, token){
    const reuslt = await sequelizeInstance.transaction(async tr => {
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

  static async findByUsername(username){
    return await sequelizeInstance.transaction(async tr => {
      const user = await UserModel.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { username },
                { email: username}
              ]
            },
            {
              deletedAt: {
                [Op.is]: null
              }
            }
          ]
        },
        transaction: tr
      })
      if(user) return user.toJSON();
        else return null;
    })
  }
}
