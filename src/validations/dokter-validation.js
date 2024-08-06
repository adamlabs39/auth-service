import { z } from "zod";
import { faskesUuidRequired, nameRequired, roleUuidRequired, uuidRequired } from "./message-validation-error.js";

export default class DokterValidation {
  static CREATE = z.object({
    faskesUuid: z.string().min(1, faskesUuidRequired),
    bpjsCode: z.string(),
    roleUuid: z.string().min(1, roleUuidRequired),
    queueCode: z.string(),
    name: z.string().min(1, nameRequired),
    title: z.string(),
    sip: z.string(),
    kuotaJkn: z.string(),
    kuotaNonJkn: z.string(),
    serviceTime: z.number(),
    serviceDuration: z.number(),
    locationUuid: z.string(),
    status: z.boolean()
  });

  static UPDATE = z.object({
    uuid: z.string().min(1, uuidRequired),
    faskesUuid: z.string().min(1, faskesUuidRequired),
    bpjsCode: z.string(),
    queueCode: z.string(),
    roleUuid: z.string().min(1, roleUuidRequired),
    name: z.string().min(1, nameRequired),
    title: z.string(),
    sip: z.string(),
    kuotaJkn: z.string(),
    kuotaNonJkn: z.string(),
    serviceTime: z.number(),
    serviceDuration: z.number(),
    locationUuid: z.string(),
    status: z.boolean()
  });

  static UUID = z.string().min(1, uuidRequired);

}
