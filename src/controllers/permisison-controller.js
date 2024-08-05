import PermisisonService from "../services/permision-service.js";

export default class PermisionController {
  static async create(request, response, nextFunction) {
    try {
      const result = await PermisisonService.create(request.author, request.body);
      response.status(201).json(result);
    } catch (error) {
      nextFunction(error);
    }
  }
  
  static async update(request, response, nextFunction) {
    try {
      request.body.uuid = request.params.uuid;
      const result = await PermisisonService.update(request.author, request.body);
      response.status(202).json(result);
    } catch (error) {
      nextFunction(error);
    }
  }
  
  static async delete(request, response, nextFunction) {
    try {
      const result = await PermisisonService.delete(request.author, request.params.uuid);
      response.status(202).json(result);
    } catch (error) {
      nextFunction(error);
    }
  }
  
  static async findByUuid(request, response, nextFunction) {
    try {
      const result = await PermisisonService.findByUuid(request.params.uuid);
      response.status(200).json(result);
    } catch (error) {
      nextFunction(error);
    }
  }
  
  static async findAllByRole(request, response, nextFunction) {
    try {
      const result = await PermisisonService.findByRole(request.author, request.params.uuid);
      response.status(200).json(result);
    } catch (error) {
      nextFunction(error);
    }
  }
}
