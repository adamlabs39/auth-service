import { Op } from "sequelize";
import * as bcrypt from "bcrypt";
import { FaskesModel, PegawaiModel, PractitionerModel, RoleModel, UserModel } from "@adameds/model-sdk/datamaster";
import sequelizeInstance from "@adameds/model-sdk/instance";
import permissions from "../../permissions.json" assert { type: 'json'}

export async function initSueprAdmin() {
  await sequelizeInstance.transaction(async (tr) => {
    // create super admin
    const [roleSuperAdmin, ] = await RoleModel.findOrCreate({
      where: {
        [Op.and]: [
          {
            name: "super admin",
          },
          {
            code: "SPR-ADM",
          },
        ],
      },
      defaults: {
        name: "super admin",
        code: "SPR-ADM",
        status: true,
      },
      transaction: tr,
    });
    await UserModel.findOrCreate({
      where: {
        [Op.and]: [
          {
            email: "admin@gmail.com",
          }
        ],
      },
      defaults: {
        roleUuid: roleSuperAdmin.toJSON().uuid,
        phone: "081341079104",
        email: "admin@gmail.com",
        username: "adameds-service-center",
        permissions: JSON.stringify(permissions.permissions[0]),
        password: await bcrypt.hash("admin123", 10),
        first_title: "spr",
        last_title: ".ad",
        status: true,
      },
      transaction: tr,
    });
  });
}

export async function initAdmin() {
  await sequelizeInstance.transaction(async (tr) => {
    const [roleAdmin, ] = await RoleModel.findOrCreate({
      where: {
        [Op.and]: [{ name: "admin" }, { code: "ADM" }],
      },
      defaults: {
        name: "admin",
        code: "ADM",
        status: true,
      },
      transaction: tr
    });
    
    
    
    const [ faskes, ] = await FaskesModel.findOrCreate({
      where: {
        [Op.and]: [
          { code: "CLS" },
          { name: "Cliic Long Sehat" }
        ]
      },
      defaults: {
        code: "CLS",
        name: "Cliic Long Sehat",
        status: true
      },
      transaction: tr,
      attributes: ["uuid", "name", "code", "status"],
    })
    

    const [pegawai, ] = await PegawaiModel.findOrCreate(
      {
        where: {
          nik: "9999999999999999"
        },
        defaults: {
          faskes_uuid: faskes.toJSON().uuid,
          name: "Alliano",
          nik: "9999999999999999",
          tanggal_lahir: new Date(),
          gender: "Laki-laki",
          status: true
         },
         transaction: tr
      }
    )

    const [practitioner, ] = await PractitionerModel.findOrCreate(
      {
        where: {
          [Op.and]: [
            {
              code_bpjs: "cd_bpj",
            },
            {
              deletedAt: {
                [Op.is]: null
              }
            }
          ]
        },
        transaction: tr,
        defaults: {
          faskes_uuid: faskes.toJSON().uuid,
          pegawai_uuid: pegawai.toJSON().uuid,
          is_doctor: true,
          status: true,
        }
      }
    )

    await UserModel.findOrCreate({
      where: {
        [Op.and]: [{ email: "khabib@gmail.com", username: "khabib77" }],
      },
      transaction: tr,
      defaults: {
        roleUuid: roleAdmin.toJSON().uuid,
        faskesUuid: faskes.toJSON().uuid,
        practitionerUuid: practitioner.toJSON().uuid,
        phone: "081341922345",
        username: "khabib77",
        email: "khabib@gmail.com",
        password: await bcrypt.hash("khabib123", 10),
        status: true,
        permissions: JSON.stringify(permissions.permissions[1]),
      },
    });
  });
}