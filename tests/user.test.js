import sequlizeInstance from "../src/configurations/sequelize-configuration.js";
import UserModel from "models-sdk/models/user-model.js"
describe("API /v1/user", () => {
  it('should sync db', async() => {
    console.log(UserModel);
    
  });  
});
