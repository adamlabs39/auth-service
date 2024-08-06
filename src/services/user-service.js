import { uuidv7 } from "uuidv7";
import UserValidation from "../validations/user-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import { toEpochDate } from "../helpers/date-helper.js";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/user-repository.js";
import RoleService from "./role-service.js";
import UsernameException from "./../errors/username-exception.js"

export default class UserService {
  
  static async create(author, userReq) { 
    await RoleService.checkRole(author, "super admin", "menambahkan user baru");
    const userValid = ZodValidator.validate(UserValidation.CREATE, userReq);
    userValid.uuid = uuidv7();
    userValid.createdAt = toEpochDate(new Date());
    userValid.password = await bcrypt.hash(userValid.password, 10);
    const user = await UserRepository.create(userValid);
    if(user.get() == null) throw new Error(`gagal menambahkan user baru`);
    return {
      message: "berhasil menambahkan user baru"
    }
  }

  static async update(author, userReq){
    await RoleService.checkRole(author, "super admin", "memperbarui user");
    let userValid = ZodValidator.validate(UserValidation.UPDATE, userReq);
    const user = await UserRepository.findByUuid(userValid.uuid);
    if(!user) throw new UsernameException(`user dengan uuid ${userValid.uuid} belum terdaftar!`, 400);
    const affectedRows =  await UserRepository.update({...user, ...userValid, updatedAt: toEpochDate(new Date())});
    if(affectedRows == 0) throw new Error("gagal memperbarui user");
    return { message: `berhasil memperbarui ${affectedRows} user` }
  }

  static async findAll(){
    return await UserRepository.findAll();
  }

  static async findAllDeleted() {
    return await UserRepository.findAllDeleted();
  }
  
  static async updatePassword(author, userReq) {
    const usrReqValid = ZodValidator.validate(UserValidation.UPDATE_PASSWORD, userReq);
    await RoleService.checkRole(author);
    const username = await UserRepository.updatePassword(usrReqValid);
    if(!username) throw Error(`password ${username} berhasil di update`)
    return { message: `password ${username} gagal di update` }
  }

  static async delete(author, uuid){
    const uuidValid = ZodValidator.validate(UserValidation.DELETE, uuid);
    await RoleService.checkRole(author,"super admin", "menghapus user");
    const userHasDeleted = await UserRepository.delete(uuidValid);
    if(userHasDeleted == 0) throw new Error('gagal menghapus user');
    return { message: `berhasil menghapus user` }
  }
}
