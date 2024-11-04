import { z } from "zod";
import { emailRequired, faskesUuidRequired, nameRequired, passwordRequired, phoneRequired, roleRequired, usernameRequired, uuidRequired } from "./message-validation-error.js";

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
    practitionerUuid: z.string().min(1, "practitioner uuid tidak boleh kosong").optional(),
    permissions: this.#PERMISSIONS,
    phone: z.string().min(1, phoneRequired),
    email: z.string().email().min(1, emailRequired),
    akhirGelar: z.string().min(1, "akhir gelar tidak boleh kosong").optional(),
    awalGelar: z.string().min(1, "awal gelar tidak boleh kosong").optional(),
    username: z.string().min(1, usernameRequired),
    password: z.string().min(1, passwordRequired),
    status: z.boolean(),
  });

  static UPDATE = z.object({
    roleUuid: z.string().min(1, roleRequired),
    practitionerUuid: z.string().min(1, "uuid praktisioner tidak boleh kosong").optional(),
    phone: z.string().min(1, phoneRequired),
    email: z.string().email().min(1, emailRequired),
    username: z.string().min(1, usernameRequired),
    password: z.string().min(1, passwordRequired).optional(),
    confirmPassword: z.string().min(1, "konfirmasi password tidak boleh kosong").optional(),
    awalGelar: z.string().optional(),
    akhirGelar: z.string().optional(),
    status: z.boolean(),
  }).refine(
    (ctx) => ctx.password === ctx.confirmPassword, { message: "konfirmasi password harus sama dengan password", path: ["confirmPassword"] }
  );

  static UPDATE_PASSWORD = z.object({
    uuid: z.string().min(1, uuidRequired),
    newPassword: z.string().min(1, passwordRequired),
  });

  static DELETE = z.string();
}
