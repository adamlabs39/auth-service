import DokterService from "../services/dokter-service.js";

export default class DokterController {
  static async create(request, response, nextFunction) {
    try {
      const reuslt = await DokterService.create(request.author, request.body);
      response.status(201).json(reuslt);
    } catch (error) {
      nextFunction(error);
    }
  }

  static async update(request, response, nextFunction) {
    try {
     request.body.uuid = request.params.uuid;
     const result = await DokterService.update(request.author, request.body);
     response.status(202).json(result);
    } catch (error) {
      nextFunction(error);
    }
  }

  static async delete(request, response, nextFunction) {
    try {
      const result = await DokterService.delete(request.author, request.params.uuid);
      response.status(202).json(result);
    } catch (error) {
      nextFunction(error);
    }
  }

  static async findByUuid(request, response, nextFunction) {
    try {
      const result = await DokterService.findByUuid(request.params.uuid);
      response.status(202).json(result);
    } catch (error) {
      nextFunction(error);
    }
  }
}
