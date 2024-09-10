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
    const { username, password: rawPassword } = loginRequest;
    loginRequest =  ZodValidator.validate(AuthenticationValidation.LOGIN, loginRequest);
    const user = await AuthenticationRepository.findUser(username);
    if(!user) throw new UsernameException({ message: "Gagal login", errors: [{ field: "username", message: "username", message: `username ${username} belum terdaftar!`}] }, 401);
    const isPasswordValid = await bcrypt.compare(rawPassword, user.password);
    if(!isPasswordValid) throw new UnauthorizeException({message: "Autentikasi gagal", errors: [{field: "password", message: "password anda tidak sesuai"}]});
    const { role, faskesUuid, permissions } = user;
    const token = await JwtHelper.sign({ role, username, faskesUuid });
    const keyRedis = this.generateRedisKeyByJwtToken(token);
    await redisClient.set(`token-${keyRedis}`, JSON.stringify({ token, permissions}), 'EX', (3 * 60 * 60 * 1000));
    return {
      message: "Login berhasil!",
      payload: { token }
    }
  }
  
  static async updateToken(author, faskesUuid, token){
    const { username, role } = author;
    const { permission } = await AuthenticationRepository.findByUsername(username);
    const newToken = await JwtHelper.sign({role, username, faskesUuid});
    await redisClient.set(`token-${this.generateRedisKeyByJwtToken(newToken)}`, JSON.stringify({token: newToken, permission}), 'EX', (3 * 60 * 60 * 1000));
    await redisClient.del(this.generateRedisKeyByJwtToken(token));
    return {
      message: "Success update token!",
      payload: { newToken }
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
