import jwt from "jsonwebtoken";
import "dotenv/config"
import { HttpException, HttpStatus } from "../errors/http-exception.js";
import { generateErrorMessage } from "./generate-message.js";

export class JwtHelper {

  static sign(payload) {
    return jwt.sign(payload, process.env.PRIVATE_KEY, { algorithm: "RS256", expiresIn: '3600s', issuer: "authentication-serivice" });
  }

  static veryfy(token) {
    return jwt.verify(token, process.env.PUBLIC_KEY, { algorithms: "RS256" });
  }

  static signRefreshToken(payload) {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "4200s", algorithm: "HS256", issuer: "authentication-serivic"});
  }

  static verifyRefreshToken(token){
    try{
      return jwt.verify(token, process.env.SECRET_KEY, {algorithms: "HS256"});
    }catch(error){
      if(error instanceof jwt.TokenExpiredError){
       throw new HttpException(generateErrorMessage("Gagal regresh token", "expired", "Refresh token telah kadaluarsa"), HttpStatus.UNAUTHORIZED)
      }else {
        throw error;
      }
    }
  }

}


export function genereateAuthToken(payload) {
  return {
    token: JwtHelper.sign({
      role: payload.role,
      username: payload.username,
      faskesUuid: payload.faskesUuid,
      user_uuid: payload.user_uuid
    }),
    refreshToken: JwtHelper.signRefreshToken({username: payload.username})
  }
}