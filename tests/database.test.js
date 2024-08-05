import JwtHelper from "../src/helpers/jwt-helper";
import "dotenv/config"
import "dotenv/config"
import { sequlizeInstance } from "../src/models/model-synchronize";
import { expect } from "@jest/globals";
import { log } from "console";
import PegawaiModel from "../src/models/pegawai-model";

describe("Connection test", () => {
  it("should can connect", async () => {
    await sequlizeInstance.authenticate();
  });

  it("should can syncronize db", async () => {
    await sequlizeInstance.sync({alter: false, force: true})
  });

  it('should can sign jwt', async() => {
    const token = await JwtHelper.sign({role: "super-admin", username: 'alliano'});
    console.log(token);
    expect(token).toBeDefined();
  });

  it('should can verify', async() => {
    const token = "yJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3VwZXItYWRtaW4iLCJ1c2VybmFtZSI6ImFsbGlhbm8iLCJpYXQiOjE3MjIyNjkyOTQsImV4cCI6MTcyMjI4MDA5NCwiaXNzIjoiYXV0aGVudGljYXRpb24tc2VyaXZpY2UifQ.Hr2lu4v9o26G_6_Tp60UReFJ3w9yHM55XkKbMoIBnSPbP09gwM0IG5eBEITYkWlZBAzrgvrpTrCxf5RQgG2B6Bi7DmU_JDEfHASzk025MC15TJCaOTqODnD5nrAwAoK64AJWmX9DMAZYO7xeEZzeu73kDWJpMcaVBBEWg8jRea4IG3xtz8P33WcInVQMbWtmYu7XLWEknyMoac0FNOvWD0xTtmaBKizDzoyX5okD5uEtQ-qWNe83Lgfxs-Hm7PzykelW_58KNfiYQAd9G6wUqn5d7hYVZhIJctcdHJG3jkqSLPyQMnwYv3X_hBO0peh0T1TZtsKvSBJRfSIqFGX9HA";
    const verify = await JwtHelper.veryfy(token);
    log(verify);
    expect(verify).toBeDefined();
  });


  it('should can sync', async() => {
    await PegawaiModel.sync();
  });
});
