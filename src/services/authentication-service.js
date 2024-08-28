import redisClient from "../configurations/redis-client-config.js";
import UnauthorizeException from "../errors/unauthorize-exception.js";
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
    if(!user) throw new UsernameException({ message: "Gagal login", errors: [{ field: "username", message: "username", message: `username ${validReq.username} belum terdaftar!`}] }, 401);
    const isPasswordValid = await bcrypt.compare(validReq.password, user.password);
    if(!isPasswordValid) throw new UnauthorizeException({message: "Autentikasi gagal", errors: [{field: "password", message: "password anda tidak sesuai"}]});
    const { role, username, actionCode, faskesUuid } = user;
    const token = await JwtHelper.sign({ role, username, actionCode, faskesUuid });
    await redisClient.set(`token-${this.generateRedisKeyByJwtToken(token)}`, token, 'EX', (3 * 60 * 60 * 1000));
    return {
      message: "Login berhasil!",
      payload: { token }
    }
  }
  
  static async updateToken(author, faskesUuid){
    const {role, username, actionCode } = author; 
    const token = await JwtHelper.sign({role, username, actionCode, faskesUuid});
    await redisClient.set(`token-${this.generateRedisKeyByJwtToken(token)}`, token, 'EX', (3 * 60 * 60 * 1000));
    return {
      message: "Success update token!",
      payload: { token }
    }
  }

  static async logout(author, token){
    ZodValidator.validate(AuthenticationValidation.LOGOUT, author.username);
    const affected = await redisClient.del(`token-${this.generateRedisKeyByJwtToken(token.substring(7))}`);
    if(affected ==! 1) throw new Error(`${author.username} gagal logout`)
    return { message: `${author.username} berhasil logout` }
  }

  static generateRedisKeyByJwtToken(token) {
    const [, , signature ] = token.split(".");
    return signature.substring(1, 11);
  }
}
