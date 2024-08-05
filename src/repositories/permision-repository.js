import { Op } from "sequelize";
import sequlizeInstance from "../configurations/sequelize-configuration.js";
import PermisionModel from "../models/permision-model.js";
import { toEpochDate } from "../helpers/date-helper.js";
import RoleModel from "../models/role-model.js";

export default class PermisisonRepository {
  static async create(permision) {
    const result = await sequlizeInstance.transaction(async (tr) => {
      const newPermison = await PermisionModel.create(permision, {
        transaction: tr,
      });
      return newPermison;
    });
    return result;
  }

  static async update(permision) {
    const result = await sequlizeInstance.transaction(async (tr) => {
      return await PermisionModel.update(permision, {
        where: {
          [Op.and]: [
            { uuid: permision.uuid },
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
    return result[0];
  }

  static async delete(uuid) {
    const result = await sequlizeInstance.transaction(async (tr) => {
      return await PermisionModel.update(
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
        }
      );
    });
    return result[0];
  }

  static async findByUuid(uuid) {
    const result = await sequlizeInstance.transaction(async (tr) => {
      return await PermisionModel.findOne({
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
    const result = await sequlizeInstance.transaction(async (tr) => {
      return await PermisionModel.findAll({
        where: {
          [Op.and]: [
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

  static async findAllByRole(roleUuid) {
    const result = await sequlizeInstance.transaction(async (tr) => {
      return await PermisionModel.findAll({
        where: {
          [Op.and]: [
            { roleUuid },
            {
              deletedAt: {
                [Op.is]: null,
              },
            },
          ],
        },
        transaction: tr,
        include: [
          {
            model: RoleModel,
            required: true,
            on: {
              id: sequlizeInstance.where(sequlizeInstance.col('PermisionModel'))
            }
          }
        ]
      });
    });
    return result;
  }
}
