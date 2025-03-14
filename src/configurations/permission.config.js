import {PermissionBuilder} from "@adameds/permission-sdk"
import redisClient from "./redis-client-config.js"
const permissionSdk = PermissionBuilder.setRedis(redisClient).build();

export {permissionSdk}