import express from "express";
import AuthenticationController from "../controllers/authentication-controller.js";

const publicRoutes = express.Router();
const URL_VERISON = "/v1"
publicRoutes.post(`${URL_VERISON}/login`, AuthenticationController.login);



export default publicRoutes;