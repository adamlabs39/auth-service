import express from "express";
import UserController from "../controllers/user-controller.js";
import AuthenticationController from "../controllers/authentication-controller.js";
import "dotenv/config";
import { env } from "process";
import authorizationSdk from "@adameds/authorization-sdk";
import fileUpload from "express-fileupload";

const privateRoute = express.Router();
const API_VERSION = env.API_VERSION;
privateRoute.use(authorizationSdk([]));
// user
privateRoute.delete(`/${API_VERSION}/logout`, AuthenticationController.logout);
privateRoute.put(`/${API_VERSION}/token/:faskes`, AuthenticationController.updateToken);

// user
privateRoute.post(`/${API_VERSION}/user`, UserController.create);
privateRoute.put(`/${API_VERSION}/user/:uuid`, UserController.update);
privateRoute.get(`/${API_VERSION}/user`, UserController.findAll);
privateRoute.get(`/${API_VERSION}/user/deleted`, UserController.findAllDeleted);
privateRoute.delete(`/${API_VERSION}/user/:uuid`, UserController.delete);
privateRoute.get(`/${API_VERSION}/user/:uuid/user-role`, UserController.findByUuidIncludeRole);
privateRoute.patch(`/${API_VERSION}/user/:uuid`, UserController.updatePassword);
privateRoute.post(`/${API_VERSION}/user/import`, fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true
}), UserController.import);
privateRoute.get(`/${API_VERSION}/user/export`, UserController.export);

export default privateRoute;