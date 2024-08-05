import RoleService from "../services/role-service.js";

export default class RoleController {

  static async create(request, response, nextFunction) {
    try{
     const result = await RoleService.create(request.author, request.body);
     response.status(201).json(result);
    }catch(error){
      nextFunction(error);
    }
  }

  static async update(request, response, nextFunction) {
    try{
      request.body.uuid = request.params.uuid;
      const result = await RoleService.update(request.author, request.body);
      response.status(202).json(result);
    }catch(error){
      nextFunction(error);
    }
  }

  static async find(request, response, nextFunction){
    try{
      const result = await RoleService.findByUuid(request.params.uuid);
      response.status(200).json(result)
    }catch(error){
      nextFunction(error);
    }
  }

  static async findAll(request, response, nextFunction){
    try{
      const result = await RoleService.findAll();
      response.status(200).json(result);
    }catch(error){
      nextFunction(error);
    }
  }

  static async delete(request, response, nextFunction){
    try{
      const result = await RoleService.delete(request.author, request.params.uuid);
      response.status(202).json(result)
    }catch(error){
      nextFunction(error);
    }
  }
}
