import supertest from "supertest";
import application from "../src/app";
import { DataTypes, Model } from "sequelize";
import sequlizeInstance from "../src/configurations/sequelize-configuration";
import { uuidv7 } from "uuidv7";

describe("API /v1/user", () => {
  it("shold can create user", async () => {
    const response = await supertest(application).post("/v1/user").send({
      faskesUuid: "9d403ufjh43ufh3uf8430ihf",
      roleUuid: "d843u87y4783yy4gf8tgf4",
      dokterUuid: "coijr0i3nh0uc30hfjij3ci",
      name: "jongson",
      phone: "0811341082934",
      email: "jong@gmail.com",
      username: "jongs",
      password: "embung gtw",
      inventoryMedis: true,
      inventoryNonMedis: true,
      status: true,
    }).set("Authorization", `Bearer ${TOKEN}`)
  });


  test('tes', () => {
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
});
