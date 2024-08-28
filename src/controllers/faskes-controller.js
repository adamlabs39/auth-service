import FaskesService from "../services/faskes-service.js";

export default class FaskesController {
  static async create(request, response, nextFunction) {
    try {
      const result = await FaskesService.create(request.author, request.body);
      response.status(201).json(result);
    } catch (error) {
      nextFunction(error);
    }
  }
}
