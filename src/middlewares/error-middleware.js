import jwt from "jsonwebtoken";
import UsernameException from "../errors/username-exception.js";
import BadRequestException from "../errors/bad-request-exception.js";
import DuplicateException from "../errors/duplicate-exception.js";
import { UniqueConstraintError } from "sequelize";
import { ZodError } from "zod";
import zodErrorParser from "../helpers/zod-error-parser.js";

const errorMiddleware = (error, request, response, nextFunction) => {
  if (error instanceof UsernameException) {
    response.status(error.status).json({messages: error.message});
  }
  else if(error instanceof jwt.TokenExpiredError){
    response.status(400).json({message: error.message})
  }
  else if(error instanceof BadRequestException){
    response.status(error.status).json({message: error.message});
  }
  else if(error instanceof DuplicateException){
    response.status(error.code).json({messages: error.message});
  }
  else if(error instanceof UniqueConstraintError){
    response.status(400).json({message: error.errors[0].message})
  }
  else if( error instanceof ZodError){
    response.status(400).json({message: zodErrorParser(error.errors)})
  }
  response.status(500).json({message: error.stack});
};

export default errorMiddleware;