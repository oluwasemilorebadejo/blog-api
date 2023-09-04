import "reflect-metadata";
import { createConnection } from "typeorm";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" }); // has to be set before requiring app because the env vars have to be set so the app module has access to it also

createConnection()
  .then((): void => {
    console.log("Connected to database");
  })
  .catch((error) => console.log("Error connecting to database:", error));

import app from "./app";

const port: string | undefined = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
