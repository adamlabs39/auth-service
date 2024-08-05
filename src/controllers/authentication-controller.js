import AuthenticationService from "../services/authentication-service.js";
import RoleService from "../services/role-service.js";

export default class AuthenticationController {
  static async login(request, response, nextFunction) {
    try {
      const result = await AuthenticationService.login(request.body);
      response.status(200).json(result)
    } catch (error) {
      nextFunction(error);
    }
  }

  static async logout(request, response, nextFunction){
    try{
      const result = await AuthenticationService.logout(request.author);
      response.status(202).json(result);
    }catch(error){
      nextFunction(error);
    }
  }
}
