import { Op } from "sequelize";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import FaskesModel from "../models/faskes-model.js";
import { toEpochDate } from "../helpers/date-helper.js";

export default class FaskesRepository {
  static async create(faskes) {
    return sequlizeInstance.transaction(async (tr) => {
      return await FaskesModel.create(faskes, { transaction: tr });
    });
  }

  static async findByName(name) {
    return await sequlizeInstance.transaction(async (tr) => {
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
    return await sequlizeInstance.transaction(async (tr) => {
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
    return await sequlizeInstance.transaction(async (tr) => {
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
    return await sequlizeInstance.transaction(async (tr) => {
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
    return await sequlizeInstance.transaction(async (tr) => {
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
