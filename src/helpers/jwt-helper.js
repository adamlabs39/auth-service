import jwt from "jsonwebtoken";
import "dotenv/config"

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
    return jwt.verify(token, process.env.SECRET_KEY, {algorithms: "HS256"});
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