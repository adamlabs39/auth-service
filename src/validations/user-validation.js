import { z } from "zod";
import { dokterUuidRequired, emailRequired, faskesUuidRequired, nameRequired, passwordRequired, phoneRequired, roleRequired, usernameRequired, uuidRequired } from "./message-validation-error.js";

export default class UserValidation {

  static #PERMISSIONS = z.array(z.object({
    module: z.string(),
    subModules: z.array(z.union([
      z.object({
        name: z.string(),
        allows: z.array(z.string())
      }),
      
      z.object({
        name: z.string(),
        features: z.array(z.object({
          name: z.string(),
          allows: z.array(z.string())
          
        }))
      })
    ]))
  }))

  static CREATE = z.object({
    faskesUuid: z.string().min(1).optional(),
    roleUuid: z.string(),
    permissions: this.#PERMISSIONS,
    name: z.string().min(1, nameRequired),
    phone: z.string().min(1, phoneRequired),
    email: z.string().email().min(1, emailRequired),
    username: z.string().min(1, usernameRequired),
    password: z.string().min(1, passwordRequired),
    inventoryMedis: z.boolean(),
    inventoryNonMedis: z.boolean(),
    status: z.boolean(),
  });

  static UPDATE = z.object({
    uuid: z.string().min(1, uuidRequired),
    faskesUuid: z.string().min(1, faskesUuidRequired),
    roleUuid: z.string().min(1, roleRequired),
    dokterUuid: z.string().min(1, dokterUuidRequired).optional(),
    name: z.string().min(1, nameRequired),
    phone: z.string().min(1, phoneRequired),
    email: z.string().email().min(1, emailRequired),
    username: z.string().min(1, usernameRequired),
    inventoryMedis: z.boolean(),
    inventoryNonMedis: z.boolean(),
    status: z.boolean(),
  });

  static UPDATE_PASSWORD = z.object({
    uuid: z.string().min(1, uuidRequired),
    newPassword: z.string().min(1, passwordRequired),
  });

  static DELETE = z.string();
}
