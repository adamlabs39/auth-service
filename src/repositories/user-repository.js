import { Op } from "sequelize";
import { toEpochDate } from "../helpers/date-helper.js";
import sequelizeInstance from "@adameds/model-sdk/instance";
import { PegawaiModel, PractitionerModel, RoleModel, UserModel } from "@adameds/model-sdk/datamaster";
import { HttpException } from "../errors/http-exception.js";
import { NotfoundException } from "@adameds/model-sdk/exceptions";

export default class UserRepository {
  static async create(request) {
    return await sequelizeInstance.transaction(async (tr) => {
      const user =  await UserModel.create(request, {
        transaction: tr,
        returning: true
      });
      const 
      { 
        uuid, roleUuid, practitionerUuid,
        phone, email, username, photo, awalGelar,
        akhirGelar, permissions,
        createdAt
      } = user.toJSON();
      return { 
        uuid, roleUuid, practitionerUuid,
        phone, email, username, photo, awalGelar,
        akhirGelar, permissions,
        createdAt
      }
    });
  }

  static async update(request) {
    return sequelizeInstance.transaction(async (tr) => {
      const { email, faskesUuid, username } = request;
      const [ affectedRow, [userUpdated] ] = await UserModel.update(request, {
        where: {
          [Op.and]: [
            { email },
            { faskesUuid },
            {
              deletedAt: {
                [Op.is]: null,
              },
            },
          ],
        },
        returning: true,
        transaction: tr,
      });
      if(affectedRow !== 1){
        throw new HttpException(
          {
            message: "Data gagal di edit",
          }, 500
        )
      }
      else {
        const { 
          uuid, roleUuid, practitionerUuid,
          phone, username, photo, awalGelar,
          akhirGelar, permissions,
          createdAt
         } = userUpdated.toJSON();
         return {
          uuid, roleUuid, practitionerUuid,
          phone, email, username, photo, awalGelar,
          akhirGelar, permissions,
          createdAt
         }
      }
    });
  }

  static async countUserByUuid(uuid) {
    return await sequelizeInstance.transaction(async (tr) => {
      return await UserModel.count({
        where: {
          [Op.and]: [
            { uuid },
            {
              deletedAt: {
                [Op.is]: null,
              },
            },
          ],
        },
        transaction: tr,
      });
    });
  }

  static async findAll(page, pageSize, order, role, name, faskesUuid) {
    const offset = page * pageSize;
    UserModel.hasOne(RoleModel, {
      foreignKey: "uuid",
      sourceKey: "roleUuid",
      constraints: false,
    });
    RoleModel.belongsTo(UserModel, {
      foreignKey: "uuid",
      targetKey: "roleUuid",
      constraints: false,
    });

    UserModel.hasOne(PractitionerModel, {
      foreignKey: "uuid",
      sourceKey: "practitionerUuid",
      constraints: false
    })

    PractitionerModel.belongsTo(UserModel, {
      foreignKey: "practitionerUuid",
      targetKey: "uuid",
      constraints: false
    })
    return await sequelizeInstance.transaction(async (tr) => {
      if (name) {
        const { count, rows } = await UserModel.findAndCountAll({
          limit: pageSize,
          offset: offset,
          order: [["id", order]],
          transaction: tr,
          attributes: ["uuid", "username", "email", "phone", "status", "permissions", "faskesUuid", "createdAt"],
          where: {
            faskesUuid
          },
          include: [
            {
              model: RoleModel,
              attributes: ["name", "uuid"],
              where: role,
              required: true,
            },
            {
              model: PractitionerModel,
              required: true,
              attributes: ["uuid"],
              include: [
                {
                  model: PegawaiModel,
                  required: true,
                  attributes: ["uuid", "name", "nik", "first_title", "last_title", "gender", "tanggal_lahir"],
                  where:
                    sequelizeInstance.where(
                      sequelizeInstance.fn("LOWER", sequelizeInstance.col("PractitionerModel->PegawaiModel.name")),
                      Op.like,
                      `%${name.toLowerCase()}%`
                  )
                }
              ]
            }
          ],
        });        
        const payload = rows.map((user) => {
          const practitionerUuid = user.toJSON().PractitionerModel.uuid;
          const { name, nik, first_title, last_title, gender, tanggal_lahir } = user.toJSON().PractitionerModel.PegawaiModel;
          const { name: roleName, uuid: roleUuid} = user.toJSON().RoleModel;
          const { uuid, username, email, phone, createdAt, status, faskesUuid, permissions } = user;
          return {
            faskesUuid, uuid, name, username, email,
            phone, status, createdAt,
            practitioner: {
              uuid: practitionerUuid,
              nik, first_title, last_title,
              gender, tanggal_lahir,
            },
            role: {
              uuid: roleUuid,
              name: roleName
            },
            permissions
          };
        });
        return {
          payload,
          properties: {
            totalItem: count,
            totalPage: Math.ceil(count / pageSize),
            currentPage: page,
          },
        };
      }
      else {
        const { count, rows } = await UserModel.findAndCountAll({
          limit: pageSize,
          offset: offset,
          order: [["id", order]],
          transaction: tr,
          where: {
            faskesUuid
          },
          attributes: ["uuid", "username", "email", "phone", "status", "permissions", "faskesUuid", "createdAt"],
          include: [
            {
              model: RoleModel,
              attributes: ["name", "uuid"],
              where: role,
              required: true,
            },
            {
              model: PractitionerModel,
              required: true,
              attributes: ["uuid"],
              include: [
                {
                  model: PegawaiModel,
                  required: true,
                  attributes: ["uuid", "name", "nik", "first_title", "last_title", "gender", "tanggal_lahir"],
                }
              ]
            }
          ],
        });        
        const payload = rows.map((user) => {
          const practitionerUuid = user.toJSON().PractitionerModel.uuid;
          const { name, nik, first_title, last_title, gender, tanggal_lahir } = user.toJSON().PractitionerModel.PegawaiModel;
          const { name: roleName, uuid: roleUuid} = user.toJSON().RoleModel;
          const { uuid, username, email, phone, createdAt, status, faskesUuid, permissions } = user;
          return {
            faskesUuid, uuid, name, username, email,
            phone, status, createdAt,
            practitioner: {
              uuid: practitionerUuid,
              nik, first_title, last_title,
              gender, tanggal_lahir,
            },
            role: {
              uuid: roleUuid,
              name: roleName
            },
            permissions
          };
        });
        return {
          payload,
          properties: {
            totalItem: count,
            totalPage: Math.ceil(count / pageSize),
            currentPage: page,
          },
        };
      }
    });
  }

  static async findByUuid(uuid) {
    return await sequelizeInstance.transaction(async (tr) => {
      const user = await UserModel.findOne({
        where: {
          [Op.and]: [
            { uuid: uuid },
            {
              deletedAt: {
                [Op.is]: null,
              },
            },
          ],
        },
        transaction: tr,
        attributes: ["uuid", "roleUuid", "faskesUuid","username", "email", "phone", "createdAt", "updatedAt"],
      });
      if(user){
        const { uuid, roleUuid, faskesUuid, username, email, phone, createdAt} = user.toJSON();
        return {
          uuid, roleUuid, faskesUuid, username, email,
          phone, createdAt
        }
      }
      else {
        throw new NotfoundException(
          {
            message: `uuid tidak diketahui`
          }
        )
      }
    });
  }

  static async findByUsername(username) {
    try {
      const result = await sequelizeInstance.transaction(async (tr) => {
        return await UserModel.findOne({
          where: { username },
          transaction: tr,
          attributes: ["uuid", ["role_uuid", "roleUuid"], "username", "email", "phone", ["created_at", "createdAt"], ["updated_at", "updatedAt"]],
        });
      });
      return result.get();
    } catch (error) {
      throw error;
    }
  }

  static async findAllDeleted() {
    const result = await sequelizeInstance.transaction(async (tr) => {
      return await UserModel.findAll({
        where: {
          deletedAt: {
            [Op.not]: null,
          },
        },
        transaction: tr,
        attributes: ["uuid", ["role_uuid", "roleUuid"], "name", "username", "email", "phone", ["created_at", "createdAt"], ["updated_at", "updatedAt"], ["deleted_at", "deletedAt"]],
      });
    });
    return result !== null ? result.map((userDeleted) => userDeleted.toJSON()) : result;
  }

  static async updatePassword(password, uuid) {
    return await sequelizeInstance.transaction(async (tr) => {
      const afectedRow = await UserModel.update(
        { password },
        {
          where: {
            [Op.and]: [
              { uuid },
              {
                deletedAt: {
                  [Op.is]: null,
                },
              },
            ],
          },
          transaction: tr,
          returning: ["username"],
        }
      );
      return afectedRow[1][0];
    });
  }

  static async delete(uuid) {
    const result = await sequelizeInstance.transaction(async (tr) => {
      const afectedRow = await UserModel.update(
        { deletedAt: toEpochDate(new Date()) },
        {
          where: {
            [Op.and]: [
              { uuid },
              {
                deletedAt: {
                  [Op.is]: null,
                },
              },
            ],
          },
          transaction: tr,
          returning: ["username"],
        }
      );
      return afectedRow[0];
    });
    return result;
  }

  static async findByUuidIncludeRole(uuid) {
    return await sequelizeInstance.transaction(async (tr) => {
      const user = await UserModel.findOne({
        where: {
          [Op.and]: [
            { uuid },
            {
              deletedAt: {
                [Op.is]: null,
              },
            },
          ],
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
            }),
          },
        ],
      });
      return user;
    });
  }
}
