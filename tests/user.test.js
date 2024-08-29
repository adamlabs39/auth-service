import supertest from "supertest";
import application from "../src/app";
import { DataTypes, Model } from "sequelize";
import sequlizeInstance from "../src/configurations/sequelize-configuration";
import { uuidv7 } from "uuidv7";
import UserService from "../src/services/user-service";
import RoleService from "../src/services/role-service";
import PermisisonService from "../src/services/permision-service";
import { z } from "zod";

describe("API /v1/user", () => {
  it("shold can create user", async () => {
    const response = await supertest(application)
      .post("/v1/user")
      .send({
        faskesUuid: "9d403ufjh43ufh3uf8430ihf",
        roleUuid: "d843u87y4783yy4gf8tgf4",
        dokterUuid: "coijr0i3nh0uc30hfjij3ci",
        name: "jongson",
        phone: "0811341082934",
        email: "jong@gmail.com",
        username: "jongs",
        password: "embung gtw",
        iventoryMedis: true,
        iventoryNonMedis: true,
        status: true,
      })
      .set("Authorization", `Bearer ${TOKEN}`);
  });

  test("tes", () => {
    console.log(sequlizeInstance.models.UserModel);
  });

  it("user", async () => {
    class Makhluk extends Model {}
    Makhluk.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          primaryKey: true,
          autoIncrement: true,
        },
        uuid: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: false,
        },
        personUuid: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize: sequlizeInstance,
        underscored: true,
        tableName: "makhluk",
        timestamps: false,
      }
    );

    class Person extends Model {}
    Person.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          primaryKey: true,
          autoIncrement: true,
        },
        uuid: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: false,
        },
      },
      {
        sequelize: sequlizeInstance,
        underscored: true,
        tableName: "persons",
        timestamps: false,
      }
    );

    await sequlizeInstance.sync({ force: true, alter: false });
    const makhluk = await Makhluk.create(
      {
        uuid: uuidv7(),
        name: "makhluk 1",
        personUuid: uuidv7(),
      },
      {
        returning: ["name", "uuid", "personUuid"],
        logging: console.log,
      }
    );
    console.log(makhluk.get());
  });

  it("should can create user", async () => {
    const user = await UserService.create(
      { roleUuid: "01914f60-e267-769c-87e8-9a6d628cc056" },
      {
        faskesUuid: "9d403ufjh43ufh3uf8430ihf",
        role: "Cleaning Service",
        dokterUuid: "coijr0i3nh0uc30hfjij3ci",
        name: "joko",
        phone: "0811341022334",
        email: "joko@gmail.com",
        username: "joko12",
        password: "sample",
        iventoryMedis: true,
        iventoryNonMedis: true,
        status: true,
      }
    );
    console.log(user.message);
  });

  it("should unique uuid", async () => {
    const permision = await PermisisonService.create(
      {
        faskesUuid: "id4u8r8ru93yf7gg3ygffh9d",
        category: "example",
        mainMenuCode: "CTRL-EX",
        mainMenuName: "CTRL",
        mainMenu: "core",
        subMenuCode: "CR",
        subMenuName: "core",
        status: true,
      }
    );
  });
});
