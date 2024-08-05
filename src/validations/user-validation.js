import { z } from "zod";

export default class UserValidation {
  static CREATE = z.object({
    faskesUuid: z.string(),
    roleUuid: z.string(),
    dokterUuid: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
    username: z.string(),
    password: z.string(),
    iventoryMedis: z.boolean(),
    iventoryNonMedis: z.boolean(),
    status: z.boolean(),
  });
  
  static UPDATE = z.object({
    uuid: z.string(),
    faskesUuid: z.string(),
    roleUuid: z.string(),
    dokterUuid: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
    username: z.string(),
    iventoryMedis: z.boolean(),
    iventoryNonMedis: z.boolean(),
    status: z.boolean(),
  });

  static UPDATE_PASSWORD = z.object({
    uuid: z.string(),
    newPassword: z.string()
  });

  static DELETE = z.string();
}