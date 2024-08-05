import { z } from "zod";

export default class PermisionValidation {
  static CREATE = z.object({
    faskesUuid: z.string(),
    category: z.string(),
    mainMenuCode: z.string(),
    mainMenuName: z.string(),
    mainMenu: z.string(),
    subMenuName: z.string(),
    subMenuCode: z.string(),
    status: z.boolean()
  });

  static UPDATE = z.object({
    uuid: z.string(),
    faskesUuid: z.string(),
    category: z.string(),
    mainMenuCode: z.string(),
    mainMenuName: z.string(),
    mainMenu: z.string(),
    subMenuName: z.string(),
    subMenuCode: z.string(),
    status: z.boolean()
  });

  static UUID = z.string();
}
