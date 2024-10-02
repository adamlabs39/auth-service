import express from "express";
import AuthenticationController from "../controllers/authentication-controller.js";
import "dotenv/config";
import { env } from "process";

const publicRoutes = express.Router();
const URL_VERISON = env.API_URL_VERSION;
publicRoutes.post(`/${URL_VERISON}/login`, AuthenticationController.login);



export default publicRoutes;