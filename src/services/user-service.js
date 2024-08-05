import { uuidv7 } from "uuidv7";
import UserValidation from "../validations/user-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import { toEpochDate } from "../helpers/date-helper.js";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/user-repository.js";
import BadRequestException from "../errors/bad-request-exception.js";
import RoleService from "./role-service.js";
import UsernameException from "./../errors/username-exception.js"

export default class UserService {
  
  static async create(author, userReq) { 
    const userValid = ZodValidator.validate(UserValidation.CREATE, userReq);
    await this.#checkRole(author, "super admin");
    userValid.uuid = uuidv7();
    userValid.createdAt = toEpochDate(new Date());
    userValid.password = await bcrypt.hash(userValid.password, 10);
    return await UserRepository.create(userValid);
  }

  static async update(author, userReq){
    await this.#checkRole(author, "super admin");
    let userValid = ZodValidator.validate(UserValidation.UPDATE, userReq);
    const user = await UserRepository.findByUuid(userValid.uuid);
    if(!user) throw new UsernameException(`user dengan uuid ${userValid.uuid} belum terdaftar!`, 400);
    return await UserRepository.update({...user, ...userValid, updatedAt: toEpochDate(new Date())});
  }

  static async findAll(){
    return await UserRepository.findAll();
  }

  static async findAllDeleted() {
    return await UserRepository.findAllDeleted();
  }
  
  static async updatePassword(author, userReq) {
    const usrReqValid = ZodValidator.validate(UserValidation.UPDATE_PASSWORD, userReq);
    this.#checkRole(author);
    const username = await UserRepository.updatePassword(usrReqValid);
    if(!username) throw Error(`password ${username} berhasil di update`)
    return { message: `password ${username} gagal di update` }
  }

  static async delete(author, uuid){
    const uuidValid = ZodValidator.validate(UserValidation.DELETE, uuid);
    await this.#checkRole(author);
    const userHasDeleted = await UserRepository.delete(uuidValid);
    if(userHasDeleted == 0) throw new Error('gagal menghapus user');
    return { message: `berhasil menghapus user` }
  }

  static async #checkRole(author, allowRole){
    const role = await RoleService.findByUuid(author.roleUuid);
    if(!role) throw new BadRequestException(`anda tidak memiliki hak akses untuk mendaftarkan user baru`)
    if(role.get().name !== allowRole) throw new BadRequestException(`${author.username} tidak memiliki hak akses untuk mendaftarkan user baru`);
  }
}
