import { z } from "zod";
import { dokterUuidRequired, emailRequired, faskesUuidRequired, nameRequired, passwordRequired, phoneRequired, roleUuidRequired, usernameRequired, uuidRequired } from "./message-validation-error.js";

export default class UserValidation {
  static CREATE = z.object({
    faskesUuid: z.string().min(1, faskesUuidRequired),
    roleUuid: z.string().min(1, roleUuidRequired),
    dokterUuid: z.string().min(1, dokterUuidRequired),
    name: z.string().min(1, nameRequired),
    phone: z.string().min(1, phoneRequired),
    email: z.string().email().min(1, emailRequired),
    username: z.string().min(1, usernameRequired),
    password: z.string().min(1, passwordRequired),
    iventoryMedis: z.boolean(),
    iventoryNonMedis: z.boolean(),
    status: z.boolean(),
  });
  
  static UPDATE = z.object({
    uuid: z.string().min(1, uuidRequired),
    faskesUuid: z.string().min(1, faskesUuidRequired),
    roleUuid: z.string().min(1, roleUuidRequired),
    dokterUuid: z.string().min(1, dokterUuidRequired),
    name: z.string().min(1, nameRequired),
    phone: z.string().min(1, phoneRequired),
    email: z.string().email().min(1, emailRequired),
    username: z.string().min(1, usernameRequired),
    iventoryMedis: z.boolean(),
    iventoryNonMedis: z.boolean(),
    status: z.boolean(),
  });

  static UPDATE_PASSWORD = z.object({
    uuid: z.string().min(1, uuidRequired),
    newPassword: z.string().min(1, passwordRequired)
  });

  static DELETE = z.string();
}