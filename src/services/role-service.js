import { uuidv7 } from "uuidv7";
import DuplicateException from "../errors/duplicate-exception.js";
import RoleRepository from "../repositories/role-repository.js";
import RoleValidation from "../validations/role-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import { toEpochDate } from "../helpers/date-helper.js";
import NotFoundException from "../errors/not-found-exception.js";

export default class RoleService {

  static async create(author, roleReq) {
    console.log(author);
    const roleValid = ZodValidator.validate(RoleValidation.CREATE, roleReq);
    this.checkRole(author, "super admin")
    const totalSameRole = await RoleRepository.countByName(roleValid.name);
    if(totalSameRole !== 0) throw new DuplicateException(`role ${roleValid.name} sudah terdaftar!`, 400);
    roleValid.uuid = uuidv7();
    roleValid.createdAt = toEpochDate(new Date());
    return await RoleRepository.create(roleValid);
  }

  static async findByUuid(uuid){
    return await RoleRepository.findByUuid(uuid);
  }

  static async update(author, roleReq){
    const roleValid = ZodValidator.validate(RoleValidation.UPDATE, roleReq);
    this.checkRole(author, "super admin");
    let role = await RoleRepository.findByUuid(roleReq.uuid);
    role = role.get();
    if(!role) throw new NotFoundException(`role ${roleValid.name} tidak ditemukan`);
    return await RoleRepository.update({...role, ...roleValid, updatedAt: toEpochDate(new Date())});
  }

  static async delete(author, uuid){
    this.checkRole(author, "super admin");
    const role = await RoleRepository.deleteByUuid(uuid);
    return role;
  }

  static async findAll() {
    return await RoleRepository.findAll();
  }

  static async checkRole(author, allowRole){
    const { name: role } = await this.findByUuid(author.roleUuid);
    if(role !== allowRole) throw new BadRequestException(`${role.username} tidak memiliki hak akses untuk melakukan update role`);
  }

}
