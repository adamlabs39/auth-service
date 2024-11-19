import { PegawaiModel, PractitionerModel, RoleModel, UserModel } from "@adameds/model-sdk/datamaster";
import { NotfoundException } from "@adameds/model-sdk/exceptions";
import sequelizeInstance from "@adameds/model-sdk/instance";
import { Op } from "sequelize";
import UnauthorizeException from "../errors/unauthorize-exception.js";

export default class AuthenticationRepository {
  
  static async login(username) {
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
      });

      UserModel.hasOne(PractitionerModel, {
        constraints: false,
        foreignKey: "uuid",
        sourceKey: "practitionerUuid"
      })

      PractitionerModel.belongsTo(UserModel, {
        constraints: false,
        foreignKey: "uuid",
        targetKey: "practitionerUuid"
      })
      if(username == "admin@gmail.com" || username == "adameds-service-center"){
        const user = await UserModel.findOne(
          {
            transaction: tr,
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
            attributes: ["uuid", ["faskes_uuid", "faskesUuid"], "username", "email", "phone", ["role_uuid", "roleUuid"], "password", "permissions"],
            include: [
              {
                required: true,
                attributes: ["name"],
                model: RoleModel
              }
            ]
          }
        );
        if(user){
          const { 
            uuid, faskesUuid, username, email, password, phone,
            RoleModel: role, permissions
           } = user.toJSON();
           return {
            uuid, faskesUuid, username, email, password, phone,
            role: role.name, permissions
           }
        }
        else {
          throw new UnauthorizeException(
            {
              message: "gagal login",
              errors: [
                {
                  message: `user tidak ditemukan`
                }
              ]
            }
          )
        }
      }
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
        attributes: ["uuid", ["faskes_uuid", "faskesUuid"], "username", "email", "phone", ["role_uuid", "roleUuid"], "password", "permissions"],
        transaction: tr,
        include: [
          {
            model: RoleModel,
            required: true,
            attributes: ["name"]
          },
          {
            model: PractitionerModel,
            required: true,
            attributes: ["pegawai_uuid"],
            include: [
              {
                model: PegawaiModel,
                as: "pegawai",
                required: true,
                attributes: ["name"]
              }
            ]
          }
        ]
      });
      if(user) {
        const 
          {
            uuid, faskesUuid, username, email, password, phone,
            RoleModel: role, PractitionerModel: practitioner, permissions
          } = user.toJSON();
        return {
          uuid, faskesUuid, username, email, password, phone,
          role: role.name, name: practitioner.pegawai.name,
          permissions
        }
      }
      else {
        throw new UnauthorizeException(
          {
            message: `gagal login`,
            errors: [
              {
                message: `username ${username} bekum terdaftar`
              }
            ]
          }
        )
      }
    });
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
        attributes: ["permissions"],
        transaction: tr
      })
      if(user){
        const { permissions } = user.toJSON();
        return { permissions }
      }
      else {
        throw new NotfoundException(
          {
            message: "Faskes tidak ditemukan",
            errors: [
              {
                message: `faskes tidak ditemukan, pastikan uuid atau nama faskes benar`
              }
            ]
          }
        )
      }
    })
  }
}
