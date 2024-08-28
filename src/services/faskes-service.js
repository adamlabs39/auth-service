import FaskesRepository from "../repositories/faskes-repository.js";
import FaskesValidation from "../validations/faskes-valitation.js";
import ZodValidator from "../validations/zod-validator.js";
import RoleService from "./role-service.js";

export default class FaskesService {
  static async create(author, faskes) {
    faskes = ZodValidator.validate(FaskesValidation.CREATE, faskes);
    const result = await FaskesRepository.create(faskes);
    if (result.get() == null) throw new Error(`gaga; menambahkan faskes ${faskes.name}`);
    return { message: `berhasil menambahkan faskes ${faskes.name}` };
  }

  static async findByName(author, name) {
    name = ZodValidator.validate(FaskesValidation.FIND, name);
    await RoleService.checkRole(author, "super admin", "mencari faskes berdasarkan nama");
    return await FaskesRepository.findByName(name);
  }

  static async findByUuid(author, uuid) {
    await RoleService.checkRole(author, "super admin", "mencari faskes berdasarkan uuid");
    return await FaskesRepository.findByUuid(uuid);
  }

  static async delete(author, uuid) {
    uuid = ZodValidator.validate(FaskesValidation.FIND, uuid);
    await RoleService.checkRole(author, "super admin", "menghapus faskes");
    const affectedRow = await FaskesRepository.deleteByUuid(uuid);
    if(affectedRow == 0) throw new Error(`gagal menghapus faskes dengan id ${uuid}`);
    return { message: `berhasil menghapus ${affectedRow} faskes` }
  }

  static async update(author, faskes) {
    faskes = ZodValidator.validate(FaskesValidation.UPDATE, faskes);
    await RoleService.checkRole(author, "super admin", "memperbarui faskes");
    const affectedRow = await FaskesRepository.update(faskes);
    if(affectedRow == 0) throw new Error(`gagal memperbarui faskes`);
    return { message: `berhasil memperbarui faskes` }
  }

  static async findAll() {
    return await FaskesRepository.findAll();
  }
}
