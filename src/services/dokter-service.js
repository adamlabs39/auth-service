import DokterValidation from "../validations/dokter-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import RoleService from "../services/role-service.js";
import DokterReposiotry from "../repositories/dokter-repository.js";

export default class DokterService {
  static async create(author, dokterReq) {
    dokterReq = ZodValidator.validate(DokterValidation.CREATE, dokterReq);
    await RoleService.checkRole(author, "super admin", "menambahkan dokter baru");
    const { uuid: roleUuid } = await RoleService.findByName(dokterReq.role)
    dokterReq = {...dokterReq, roleUuid }
    const dokter = await DokterReposiotry.create(dokterReq);
    if(dokter.get() == null) throw Error(`gagal menambahkan dokter baru`);
    return { message: "berhasil menambahkan dokter baru" }
  }

  static async update(author, dokterReq) {
    dokterReq = await ZodValidator.validate(DokterValidation.UPDATE, dokterReq);
    await RoleService.checkRole(author, "super admin", "memperbarui dokter");
    const { uuid: roleUuid } = await RoleService.findByName(dokterReq.role)
    dokterReq = {...dokterReq, roleUuid }
    const affectedRows = await DokterReposiotry.update(dokterReq);
    if(affectedRows == 0) throw new Error("gagal memperbarui dokter");
    return { message: `berhasil memperbarui ${affectedRows} dokter`}
}

static async delete(author, uuid) {
    const uuidValid = ZodValidator.validate(DokterValidation.UUID, uuid);
    await RoleService.checkRole(author, "super admin", "menghapus dokter");
    const affectedRows = await DokterReposiotry.delete(uuidValid);
    if(affectedRows == 0) throw new Error("gagal menghapus dokter");
    return { message: `berhasil menghapus ${affectedRows} dokter`}
}

  static async findByUuid(uuid) {
    return await DokterReposiotry.findByUuid(uuid);
  }

  static async findAll() {
    return await DokterReposiotry.findAll();
  }
}
