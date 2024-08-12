import UsernameException from "../errors/username-exception.js";
import JwtHelper from "../helpers/jwt-helper.js";
import AuthenticationRepository from "../repositories/authentication-repository.js";
import AuthenticationValidation from "../validations/authentication-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import bcrypt from "bcrypt";

export default class AuthenticationService {

  static async login(loginRequest) {
    const validReq = ZodValidator.validate(AuthenticationValidation.LOGIN, loginRequest);
    const user = await AuthenticationRepository.findUser(validReq.username);
    if(!user) throw new UsernameException(`username ${validReq.username} belum terdaftar!`, 400);
    const isPasswordValid = await bcrypt.compare(validReq.password, user.password);
    if(!isPasswordValid) throw new UsernameException(`username atau password anda salah!`, 400);
    const token = await JwtHelper.sign({roleUuid: user.get().roleUuid, username: user.get().username, faskesUuid: user.get().faskesUuid});
    await AuthenticationRepository.updateToken(user.uuid, token);
    return { token }
  }

  static async logout(author){
    const userValid = ZodValidator.validate(AuthenticationValidation.LOGOUT, author.username);
    const afecttedRow = await AuthenticationRepository.deleteToken(userValid);
    if(afecttedRow ==! 1) throw new Error(`${userValid} gagal logout`)
    return { message: `${userValid} berhasil logout` }
  }

  static async isTokenExist(username) {
    return await AuthenticationRepository.isTokenExist(username);
  }
}
