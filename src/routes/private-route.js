import express from "express";
import RoleController from "../controllers/role-controller.js";
import UserController from "../controllers/user-controller.js";
import authorizationMiddleware from "../middlewares/authorization-middleware.js";
import AuthenticationController from "../controllers/authentication-controller.js";
import PermisionController from "../controllers/permisison-controller.js";

const privateRoute = express.Router();
privateRoute.use(authorizationMiddleware);
const URL_VERISON = "/v1"

// user
privateRoute.delete(`${URL_VERISON}/logout`, AuthenticationController.logout);

// route
privateRoute.post(`${URL_VERISON}/role`, RoleController.create);
privateRoute.put(`${URL_VERISON}/role/:uuid`, RoleController.update);
privateRoute.get(`${URL_VERISON}/role/:uuid`, RoleController.find);
privateRoute.get(`${URL_VERISON}/role`, RoleController.findAll);
privateRoute.delete(`${URL_VERISON}/role/:uuid`, RoleController.delete);


// user
privateRoute.post(`${URL_VERISON}/user`, UserController.create);
privateRoute.put(`${URL_VERISON}/user/:uuid`, UserController.update);
privateRoute.get(`${URL_VERISON}/user`, UserController.findAll);
privateRoute.get(`${URL_VERISON}/user/deleted`, UserController.findAllDeleted);

// permision
privateRoute.post(`${URL_VERISON}/permision`, PermisionController.create)
privateRoute.put(`${URL_VERISON}/permision/:uuid`, PermisionController.update)
privateRoute.delete(`${URL_VERISON}/permision/:uuid`, PermisionController.delete)
privateRoute.get(`${URL_VERISON}/permision/:uuid`, PermisionController.findByUuid)
privateRoute.get(`${URL_VERISON}/permision/role/:uuid`, PermisionController.findAllByRole);



export default privateRoute;