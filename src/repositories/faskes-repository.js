import { Op } from "sequelize";
import { toEpochDate } from "../helpers/date-helper.js";
import sequelizeInstance from "@adameds/model-sdk/instance";
import { FaskesModel } from "@adameds/model-sdk/datamaster";

export default class FaskesRepository {
  static async create(faskes) {
    return sequelizeInstance.transaction(async (tr) => {
      return await FaskesModel.create(faskes, { transaction: tr });
    });
  }

  static async findByName(name) {
    return await sequelizeInstance.transaction(async (tr) => {
      return await FaskesModel.findOne({
        where: {
          [Op.and]: [
            { name },
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
  static async findByUuid(uuid) {
    return await sequelizeInstance.transaction(async (tr) => {
      return await FaskesModel.findOne({
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

  static async update(faskes) {
    return await sequelizeInstance.transaction(async (tr) => {
      const affectedRow = await FaskesModel.update(faskes, {
        where: {
          [Op.and]: [
            { uuid: faskes.uuid },
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
  }

  static async deleteByUuid(uuid) {
    return await sequelizeInstance.transaction(async (tr) => {
      const affectedRow = await FaskesModel.update(
        {
          deletedAt: toEpochDate(new Date()),
          updatedAt: toEpochDate(new Date()),
        },
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
        }
      );
      return affectedRow[0];
    });
  }

  static async findAll() {
    return await sequelizeInstance.transaction(async (tr) => {
      return await FaskesModel.findAll({
        where: {
          deletedAt: {
            [Op.is]: null,
          },
        },
        transaction: tr
      });
    });
  }
}
