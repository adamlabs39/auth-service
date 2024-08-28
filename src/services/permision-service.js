import PermisionValidation from "../validations/permision-validation.js"
import ZodValidator from "../validations/zod-validator.js"
import RoleService from "./role-service.js";
import PermisosnRepository from "../repositories/permision-repository.js"
import { toEpochDate } from "../helpers/date-helper.js";
import PermisisonRepository from "../repositories/permision-repository.js";
import BadRequestException from "../errors/bad-request-exception.js";

export default class PermisisonService {

  static async create(author, permisionReq) {
    let permisionValid = ZodValidator.validate(PermisionValidation.CREATE, permisionReq);
    await RoleService.checkRole(author, "super admin", "membuat permision baru");
    await PermisosnRepository.create(permisionValid);
    return { message: 'berhasil menambahkan permision baru' };
  }

  static async update(author, permisionReq) {
    let updatePrmision = ZodValidator.validate(PermisionValidation.UPDATE, permisionReq);
    await RoleService.checkRole(author, "super admin", "update permision baru");
    const permision = await PermisisonRepository.findByUuid(updatePrmision.uuid);
    if(!permision.get()) throw new BadRequestException(`permisison denga uuid ${updatePrmision.uuid} tidak ada`)
    updatePrmision = {...updatePrmision, updatedAt: toEpochDate(new Date())};
    const affectedRow = await PermisosnRepository.update(updatePrmision);
    if(affectedRow !== 1) throw Error('gagal mengupdate permision');
    return { message: 'berhasil memperbarui permision' };
  }

  static async delete(author, uuid) {
    const uuidValid = ZodValidator.validate(PermisionValidation.UUID, uuid);
    await RoleService.checkRole(author, "super admin", "menghapus permision");
    const affectedRow = await PermisisonRepository.delete(uuidValid);
    if(affectedRow !== 1) throw Error('gagal menghapus permision');
    return { message: 'berhasil menghapus permision' };
  }
  
  static async findByUuid(uuid) {
    const uuidValid = ZodValidator.validate(PermisionValidation.UUID, uuid);
    return await PermisisonRepository.findByUuid(uuidValid);
  }
  
  static async findAll() {
    return await PermisisonRepository.findAll();
  }
  
  static async findByRole(author, roleUuid){
    const uuidValid = ZodValidator.validate(PermisionValidation.UUID, roleUuid);
    await RoleService.checkRole(author, "super admin", "menampilkan semua role berdasarkan role uuid");
    return await PermisisonRepository.findAllByRole(uuidValid);
  }

  static async findSome(permisisons){
    return await PermisisonRepository.findSome(permisisons.toString());
  }
}
