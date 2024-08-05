import { z } from "zod";
import { passwordRequired } from "./message-validation-error.js";

export default class AuthenticationValidation {
  static LOGIN = z.object({
    username: z.string(),
    password: z.string().min(1, passwordRequired),
  });

  static LOGOUT = z.string()
}
