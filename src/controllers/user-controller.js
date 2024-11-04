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
      const page = request.query.page !== undefined ? parseInt(request.query.page) : 0;
      const pageSize = request.query.pageSize !== undefined ? parseInt(request.query.pageSize) : 10;
      const order = request.query.order !== undefined ? request.query.order : "ASC";
      const role = request.query.role !== undefined ? { name: request.query.role } : undefined;
      const name = request.query.name !== undefined ? request.query.name :  "";
      const result = await UserService.findAll(page, pageSize, order, role, name, request.author);
      response.status(200).json(result);
    }catch(error){
      nextFunction(error);
    }
  }

  static async delete(request, response, nextFunction){
    try{
      const result = await UserService.delete(request.author, request.params.uuid);
      response.status(202).json(result);
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
