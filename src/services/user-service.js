import UserValidation from "../validations/user-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import { toEpochDate } from "../helpers/date-helper.js";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/user-repository.js";
import UsernameException from "./../errors/username-exception.js"
import BadRequestException from "../errors/bad-request-exception.js";

export default class UserService {
  
  static async create(author, request) { 
    ZodValidator.validate(UserValidation.CREATE, request);
    request.password = await bcrypt.hash(request.password, 10);
    const result = await UserRepository.create(request);
    return {
      message: "Berhasil menambahkan user baru",
      payload: result
    }
  }

  static async update(author, userReq){
    let userValid = ZodValidator.validate(UserValidation.UPDATE, userReq);
    const user = await UserRepository.findByUuid(userValid.uuid);
    if(!user) throw new UsernameException(`user dengan uuid ${userValid.uuid} belum terdaftar!`, 400);
    const affectedRows =  await UserRepository.update({...user, ...userValid, updatedAt: toEpochDate(new Date())});
    if(affectedRows == 0) throw new Error("gagal memperbarui user");
    return { 
      message: `Berhasil memperbarui ${affectedRows} user`,
      payload: {
        userUuid: user.toJSON().uuid,
        username: user.toJSON().username
      }
    }
  }

  static async findAll(page, pageSize, order, role, name){
    const { properties, payload } =  await UserRepository.findAll(page, pageSize, order, role, name)
    return {
      message: "Berhasil menampilkan semua user",
      payload,
      properties
    }
  }
 
  static async findAllDeleted() {
    return {
      message: "Berhasil menampilkan semua user yang telah dihapus",
      payload: await UserRepository.findAllDeleted()
    };
  }
  
  static async updatePassword(author, userReq) {
    userReq = ZodValidator.validate(UserValidation.UPDATE_PASSWORD, userReq);
    const { newPassword: password, uuid } = userReq;
    const user = await UserRepository.updatePassword(password, uuid);
    if(!user) throw new BadRequestException(`password gagal di perbarui`);
    return { message: `password ${user.username} berhasil di update` }
  }

  static async delete(author, uuid){
    const uuidValid = ZodValidator.validate(UserValidation.DELETE, uuid);
    const userHasDeleted = await UserRepository.delete(uuidValid);
    if(userHasDeleted == 0) throw new Error('gagal menghapus user');
    return { message: `berhasil menghapus user` }
  }

  static async findByUuidIncludeRole(uuid) {
    return await UserRepository.findByUuidIncludeRole(uuid);
  }
}
 