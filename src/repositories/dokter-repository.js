import { Op } from "sequelize";
import sequelizeInstance from "../configurations/sequelize-configuration.js";
import DokterModel from "../models/dokter-model.js";
import { toEpochDate } from "../helpers/date-helper.js";

export default class DokterReposiotry {
  static async create(dokterReq) {
    const result = await sequelizeInstance.transaction(async (tr) => {
      const dokter = await DokterModel.create(dokterReq, {
        transaction: tr,
      });
      return dokter;
    });
    return result;
  }

  static async update(dokterReq) {
    const result = await sequelizeInstance.transaction(async (tr) => {
      const affectedRow = await DokterModel.update(dokterReq, {
        where: {
          [Op.and]: [
            {
              uuid: dokterReq.uuid,
            },
            {
              deletedAt: {
                [Op.is]: null,
              },
            },
          ],
        },
        transaction: tr,
      });
      return affectedRow[0];
    });
    return result;
  }

  static async delete(uuid) {
    const result = await sequelizeInstance.transaction(async (tr) => {
      const affectedRow = await DokterModel.update(
        { deletedAt: toEpochDate(new Date()) },
        {
          transaction: tr,
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
        }
      );
      return affectedRow[0];
    });
    return result;
  }

  static async findByUuid(uuid) {
    const result = await sequelizeInstance.transaction(async (tr) => {
      return await DokterModel.findOne({
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
    return result;
  }

  static async findAll() {
    return sequelizeInstance.transaction(async (tr) => {
      return await DokterModel.findAll({
        where: {
          deletedAt: {
            [Op.is]: null,
          },
        },
        transaction: tr,
      });
    });
  }
}
