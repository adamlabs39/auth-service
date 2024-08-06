import { z } from "zod";
import { passwordRequired, usernameRequired } from "./message-validation-error.js";

export default class AuthenticationValidation {
  static LOGIN = z.object({
    username: z.string().min(1, usernameRequired),
    password: z.string().min(1, passwordRequired),
  });

  static LOGOUT = z.string()
}
