import express from "express";
import "dotenv/config";
import { PermisionModel, RoleModel, sequlizeInstance, UserModel} from "./models/model-synchronize.js";
import bcrypt from "bcrypt";
import errorMiddleware from "./middlewares/error-middleware.js";
import publicRoutes from "./routes/public-route.js";
import privateRoute from "./routes/private-route.js";
import { Op, where } from "sequelize";

const APPLICATION_PORT = process.env.APPLICATION_PORT;
const APPLICATION_HOST = process.env.APPLICATION_HOST;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(publicRoutes);
app.use(privateRoute);
app.use(errorMiddleware);
app.listen(APPLICATION_PORT, APPLICATION_HOST, async () => {
  // await sequlizeInstance.sync({ alter: true, force: true });
  await sequlizeInstance.transaction(async (tr) => {
    const permision = await PermisionModel.findOrCreate(
      {
        transaction: tr,
        where: {
          category: "sample category"
        },
        defaults: {
          faskesUuid: "id4u8r8ru93yf7gg3ygffh9d",
          category: "sample category",
          mainMenuCode: "MN",
          mainMenuName: "Brogil",
          mainMenu: "core menu",
          subMenuCode: "CR",
          subMenuName: "core",
          status: true,
        },
      }
    );
    const { uuid: permisionUuid } = permision[0].get();


    const role = await RoleModel.findOrCreate(
      {
        transaction: tr,
        where: {
          name: "super admin"
        },
        defaults: {
          faskesUuid: "0191019c-608b-773c-928b-eba6b915291",
          code: "SPR-ADMN",
          name: "super admin",
          permisionUuid: permisionUuid,
          status: true,
        }
      }
    );

    const { uuid: roleUuid } = role[0].get();
    await UserModel.findOrCreate(
      { 
        transaction: tr,
        where: {
          [Op.and]: [
            {
              email: "alliano@gmail.com",
              username: "alliano-dev"
            }
          ]
        },
        defaults: {
          faskesUuid: "9d403ufjh43ufh3uf8430ihf",
          roleUuid: roleUuid,
          dokterUuid: "coijr0i3nh0uc30hfjij3ci",
          name: "alliano",
          phone: "0811341082934",
          email: "alliano@gmail.com",
          username: "alliano-dev",
          password: await bcrypt.hash("secreet_pass", 10),
          inventoryMedis: true,
          inventoryNonMedis: true,
          status: true,
        }
      }
    );
  });
  console.log(`The server running on http://${APPLICATION_HOST}:${APPLICATION_PORT}`);
});

export default app;
