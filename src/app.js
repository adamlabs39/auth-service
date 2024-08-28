import express from "express";
import "dotenv/config";
import {
  RoleModel,
  sequlizeInstance,
  UserActionModel,
  UserModel,
} from "./models/model-synchronize.js";
import errorMiddleware from "./middlewares/error-middleware.js";
import publicRoutes from "./routes/public-route.js";
import privateRoute from "./routes/private-route.js";
import redisClient from "./configurations/redis-client-config.js";
import requestResponseFormatterMidddleware from "./middlewares/request-response-formatter-middleware.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
const APPLICATION_PORT = process.env.APPLICATION_PORT;
const APPLICATION_HOST = process.env.APPLICATION_HOST;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestResponseFormatterMidddleware);
app.use(publicRoutes);
app.use(privateRoute);
app.use(errorMiddleware);
redisClient.on("connect", () => console.log("Redis alredy accept request"));
app.listen(APPLICATION_PORT, APPLICATION_HOST, async () => {
  // await sequlizeInstance.sync({ alter: true, force: true });
  await redisClient.connect();
  await sequlizeInstance.transaction(async (tr) => {
    const roleSuperAdmin = await RoleModel.findOrCreate({
      where: {
        [Op.and]: [
          {
            name: "super admin"
          },
          {
            code: "SPR-ADM"
          }
        ]
      },
      defaults: {
        name: "super admin",
        code: "SPR-ADM",
        status: true
      },
      transaction: tr
    });
    const superAdmin = await UserModel.findOrCreate({
      where: {
        [Op.and]: [
          {
            email: "admin@gmail.com"
          },
          {
            name: "Nadila Aulya",
          }
        ]
      },
      defaults: {
        roleUuid: roleSuperAdmin[0].get().uuid,
        name: "Nadila Aulya",
        phone: "081341079104",
        email: "admin@gmail.com",
        username: "nadila",
        password: await bcrypt.hash("admin123", 10),
        inventoryMedis: true,
        inventoryNonMedis: true,
        status: true,
      },
      transaction: tr
    });
    await UserActionModel.findOrCreate({
      where: { userUuid: superAdmin[0].get().uuid },
      defaults: {
        actionCode: "ALL-FEATURE-CRUD"
      }
    })
  });
  console.log(`The server running on http://${APPLICATION_HOST}:${APPLICATION_PORT}`);
});

export default app;