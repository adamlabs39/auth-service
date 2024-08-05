import { z } from "zod";

export default class RoleValidation {
  static CREATE = z.object({
    faskesUuid: z.string(),
    code: z.string(),
    name: z.string(),
    permisionUuid: z.string(),
    status: z.boolean(),
  });

  static UPDATE = z.object({
    uuid: z.string(),
    faskesUuid: z.string(),
    code: z.string(),
    name: z.string(),
    permisionUuid: z.string(),
    status: z.boolean(),
  });
}
