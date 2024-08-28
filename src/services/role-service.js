import { uuidv7 } from "uuidv7";
import DuplicateException from "../errors/duplicate-exception.js";
import RoleRepository from "../repositories/role-repository.js";
import RoleValidation from "../validations/role-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import { toEpochDate } from "../helpers/date-helper.js";
import NotFoundException from "../errors/not-found-exception.js";
import BadRequestException from "../errors/bad-request-exception.js";

export default class RoleService {

  static async create(author, roleReq) {
    roleReq = ZodValidator.validate(RoleValidation.CREATE, roleReq);
    const totalSameRole = await RoleRepository.countByName(roleReq.name);
    if(totalSameRole !== 0) throw new DuplicateException(`role ${roleReq.name} sudah terdaftar!`, 400);
    roleReq = {...roleReq, createdAt: toEpochDate(new Date()) }
    await RoleRepository.create(roleReq);
    return {
      message: `berhasil membuat role ${roleReq.name}`
    }
  }

  static async findByUuid(uuid){
    return await RoleRepository.findByUuid(uuid);
  }

  static async update(author, roleReq){
    const roleValid = ZodValidator.validate(RoleValidation.UPDATE, roleReq);
    await this.checkRole(author, "super admin", "memperbarui role");
    let role = await RoleRepository.findByUuid(roleReq.uuid);
    if(!role) throw new NotFoundException(`role ${roleValid.name} tidak ditemukan`);
    role = role.get();
    const affectedRows = await RoleRepository.update({...role, ...roleValid, updatedAt: toEpochDate(new Date())});
    if(affectedRows!==1) throw Error(`gagal memperbarui role!`);
    return {
      message: `berhasil memperbarui ${affectedRows} role`
    }
  }

  static async delete(author, uuid){
    await this.checkRole(author, "super admin", "menghapus role");
    const affectedRows = await RoleRepository.deleteByUuid(uuid);
    if(affectedRows !== 1) throw new Error(`gagal meghapus role`)
    return {
      message: `berhasi menghapus ${affectedRows} role`
    };
  }

  static async findAll() {
    return await RoleRepository.findAll();
  }

  static async findByName(name){
    const role = await RoleRepository.findByName(name);
    if(role == null) throw new NotFoundException(`role ${name} tidak ditemukan`);
    const { code, uuid } = role.dataValues;
    return { name, code, uuid };
  }

  static async checkRole(author, allowRole, actionName){
    const role = await this.findByUuid(author.roleUuid);
    console.log(role);
        
    if(role == null) throw new NotFoundException(`role anda tidak valid`);
    if(role.getDataValue("name") !== allowRole) throw new BadRequestException(`${author.username} tidak memiliki hak akses untuk ${actionName}`);
  }
}