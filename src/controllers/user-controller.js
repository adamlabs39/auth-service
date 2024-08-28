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

  static async updatePassword(request, response, nextFunction){
    try{
      request.body.uuid = request.params.uuid;
      const result = await UserService.updatePassword(request.author, request.body);
      response.status(202).json(result);
    }catch(error){
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
      const page = request.query.page == null ? 1 : request.query.page;
      const limit = request.query.limit == null ? 10 : request.query.limit;
      const sortBy = request.query.sort == null ? "ASC" : request.query.sort;
      const role = request.query.role == null ? undefined : { name: request.query.role };
      const result = await UserService.findAll(page, limit, sortBy, role);
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

  static async findByUuidIncludeRole(request, response, nextFunction){
    try{
      const result = await UserService.findByUuidIncludeRole(request.params.uuid);
      response.status(200).json(result);
    }catch(error){
      nextFunction(error);
    }
  }
}
