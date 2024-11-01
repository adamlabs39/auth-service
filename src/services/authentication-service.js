import generateRedisKeyByJwtToken from "@adameds/authorization-sdk/generateKeyRedis";
import redisClient from "../configurations/redis-client-config.js";
import UnauthorizeException from "../errors/unauthorize-exception.js";
import UsernameException from "../errors/username-exception.js";
import JwtHelper from "../helpers/jwt-helper.js";
import AuthenticationRepository from "../repositories/authentication-repository.js";
import AuthenticationValidation from "../validations/authentication-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import bcrypt from "bcrypt";
import FaskesRepository from "../repositories/faskes-repository.js";

export default class AuthenticationService {

  static async login(loginRequest) {
    const { username, password: rawPassword } = loginRequest;
    loginRequest =  ZodValidator.validate(AuthenticationValidation.LOGIN, loginRequest);
    const user = await AuthenticationRepository.login(username);
    if(!user) throw new UsernameException({ message: "Gagal login", errors: [{ field: "username", message: "username", message: `username ${username} belum terdaftar!`}] }, 401);
    const isPasswordValid = await bcrypt.compare(rawPassword, user.password);
    if(!isPasswordValid) throw new UnauthorizeException({message: "Autentikasi gagal", errors: [{field: "password", message: "password anda tidak sesuai"}]});
    const { role, faskesUuid, permissions, name } = user;
    const token = await JwtHelper.sign({ role, username, faskesUuid });
    const keyRedis = generateRedisKeyByJwtToken(token)
    await redisClient.set(`token-${keyRedis}`, JSON.stringify({ token, permissions}), { EX: 3 * (60 * 60), NX: true });
    return {
      message: "Login berhasil!",
      payload: { 
        token, permissions, 
        user: { 
          faskesUuid,
          role,
          name
        }
      }
    }
  }
  
  static async updateToken(author, faskesUuid, token){
    const { username, role, name } = author;
    if(role !== "super admin"){
      throw new UnauthorizeException(
        {
          message: "gagal update token",
          errors: [
            {
              message: `${name} tidak memiliki izin untuk melakukn update token`
            }
          ]
        }
      )
    }
    const { permission } = await AuthenticationRepository.findByUsername(username);
    const { name: faskesName} = await FaskesRepository.findByUuid(faskesUuid);
    const newToken = await JwtHelper.sign({role, username, faskesUuid, name});
    await redisClient.set(`token-${generateRedisKeyByJwtToken(newToken)}`, JSON.stringify({token: newToken, permission}), { EX: 3 * (60 * 60), NX: true });
    await redisClient.del(generateRedisKeyByJwtToken(token));
    return {
      message: "Success update token!",
      payload: { 
        newToken, faskesName, faskesUuid
       }
    }
  }

  static async logout(author, token){
    ZodValidator.validate(AuthenticationValidation.LOGOUT, author.username);
    const affected = await redisClient.del(`token-${generateRedisKeyByJwtToken(token.substring(7))}`);
    if(affected ==! 1) throw new Error(`${author.username} gagal logout`)
    return { message: `${author.username} berhasil logout` }
  }

  /**
   * 
   * @deprecated
   * 
   * use this method is not recomended again, because developer has chage some logic. 
   * u can change this method with generateRedisKeyByJwtToken(token: string) that import from authorization sdk
   * @param {string} token 
   * @returns 
   */
  static generateRedisKeyByJwtToken(token) {
    const [, , signature ] = token.split(".");
    return signature.substring(1, 11);
  }
}
