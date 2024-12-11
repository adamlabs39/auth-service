import UserValidation from "../validations/user-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import { toEpochDate } from "../helpers/date-helper.js";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/user-repository.js";
import BadRequestException from "../errors/bad-request-exception.js";

export default class UserService {
  
  static async create(author, request) { 
    ZodValidator.validate(UserValidation.CREATE, request);
    request.password = await bcrypt.hash(request.password, 10);
    request.faskesUuid = author.faskesUuid;
    const result = await UserRepository.create(request, author.faskesUuid);
    return {
      message: "Berhasil menambahkan user baru",
      payload: result
    }
  }

  static async update(author, request){
    ZodValidator.validate(UserValidation.UPDATE, request);
    const user = await UserRepository.findByUuid(request.uuid);
    await UserRepository.update({...user, ...request, updatedAt: toEpochDate(new Date())});
    return { 
      message: `Data berhasil di edit`,
    }
  }

  static async findAll(page, pageSize, order, role, name, author){
    const { faskesUuid, role: r } = author;
    if(r === "super admin"){
      const data =  await UserRepository.findAllAsSuperadmin(page, pageSize, order);
      return {
        message: "Berhasil menampilkan semua users",
        payload: data.data,
        properties: data.properties
      }
    }
    const { properties, payload } =  await UserRepository.findAll(page, pageSize, order, role, name, faskesUuid)
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
    await UserRepository.delete(uuidValid);
    return { message: `berhasil menghapus user` }
  }

  static async findByUuidIncludeRole(uuid) {
    return await UserRepository.findByUuidIncludeRole(uuid);
  }
}
 