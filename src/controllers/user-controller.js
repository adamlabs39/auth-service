import UserRepository from "../repositories/user-repository.js";
import UserService from "../services/user-service.js";

export default class UserController {
  static async create(request, response, nextFunction) {
    try {
      const result = await UserService.create(request.author, request.body);
      response.status(201).json(result);
    } catch (error) {
      nextFunction(error);
    }
  }

  static async update(request, response, nextFunction){
    try{
      request.body.uuid = request.params.uuid;
      const result = await UserService.update(request.author, request.body);
      response.status(202).json(result);
    }catch(error){
      nextFunction(error);
    }
  }

  static async findAll(request, response, nextFunction) {
    try{
      const result = await UserService.findAll();
      response.status(200).json(result);
    }catch(error){
      nextFunction(error);
    }
  }

  static async findAllDeleted(request, response, nextFunction){
    try{
      const result = await UserService.findAllDeleted();
      response.status(200).json(result);
    }catch(error){
      nextFunction(error);
    }
  }
}
