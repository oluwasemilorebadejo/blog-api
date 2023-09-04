import { ConnectionOptions } from "typeorm";

const config: ConnectionOptions = {
  type: "postgres", // Database type (e.g., postgres, mysql, sqlite)
  host: "localhost", // Database host
  port: 5432, // Database port
  username: "your_username", // Database username
  password: "your_password", // Database password
  database: "your_database_name", // Database name
  entities: ["src/entities/*.ts"], // Entity files path (you'll need to adjust this)
  synchronize: true, // Automatically sync database schema on application start
  logging: true, // Enable SQL query logging
};

export = config;
