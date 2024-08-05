import express from "express";
import "dotenv/config";
import {sequlizeInstance} from "./models/model-synchronize.js"
import errorMiddleware from "./middlewares/error-middleware.js";
import publicRoutes from "./routes/public-route.js";
import privateRoute from "./routes/private-route.js";


const APPLICATION_PORT = process.env.APPLICATION_PORT;
const APPLICATION_HOST = process.env.APPLICATION_HOST;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(publicRoutes);
app.use(privateRoute)
app.use(errorMiddleware);
app.listen(APPLICATION_PORT, APPLICATION_HOST, async() => {
  // await sequlizeInstance.sync({alter: true, force: true});
  console.log(`The server running on http://${APPLICATION_HOST}:${APPLICATION_PORT}`);
});

export default app;
