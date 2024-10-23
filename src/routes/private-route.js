import express from "express";
import RoleController from "../controllers/role-controller.js";
import UserController from "../controllers/user-controller.js";
import AuthenticationController from "../controllers/authentication-controller.js";
import FaskesController from "../controllers/faskes-controller.js"
import "dotenv/config";
import { env } from "process";
import authorizationSdk from "@adameds/authorization-sdk";

const privateRoute = express.Router();
const URL_VERISON = env.API_URL_VERSION;
privateRoute.use(authorizationSdk([`/${URL_VERISON}/login`]));

// user
privateRoute.delete(`/${URL_VERISON}/logout`, AuthenticationController.logout);
privateRoute.put(`/${URL_VERISON}/token/:faskes`, AuthenticationController.updateToken);

// route
privateRoute.post(`/${URL_VERISON}/role`, RoleController.create);
privateRoute.put(`/${URL_VERISON}/role/:uuid`, RoleController.update);
privateRoute.get(`/${URL_VERISON}/role/:uuid`, RoleController.find);
privateRoute.get(`/${URL_VERISON}/role`, RoleController.findAll);
privateRoute.delete(`/${URL_VERISON}/role/:uuid`, RoleController.delete);


// user
privateRoute.post(`/${URL_VERISON}/user`, UserController.create);
privateRoute.put(`/${URL_VERISON}/user/:uuid`, UserController.update);
privateRoute.get(`/${URL_VERISON}/user`, UserController.findAll);
privateRoute.get(`/${URL_VERISON}/user/deleted`, UserController.findAllDeleted);
privateRoute.delete(`/${URL_VERISON}/user/:uuid`, UserController.delete);
privateRoute.get(`/${URL_VERISON}/user/:uuid/user-role`, UserController.findByUuidIncludeRole);
privateRoute.patch(`/${URL_VERISON}/user/:uuid`, UserController.updatePassword);


// privateRoute.get("/dev", permissionMiddleware("Admisi", "Antrian", "CHECKIN"), (req, res) => res.send("DEv"));

// faskes
privateRoute.post(`/${URL_VERISON}/faskes`, FaskesController.create);


export default privateRoute;