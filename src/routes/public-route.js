import express from "express";
import AuthenticationController from "../controllers/authentication-controller.js";
import "dotenv/config";
import { env } from "process";

const publicRoutes = express.Router();
const API_VERSION = env.API_VERSION;
publicRoutes.post(`/${API_VERSION}/login`, AuthenticationController.login);
publicRoutes.post(`/${API_VERSION}/refresh-token`, AuthenticationController.refreshToken);



export default publicRoutes;