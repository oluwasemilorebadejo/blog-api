import { DataSourceOptions } from "typeorm";
import path from "path";

const entityPath = path.resolve(__dirname, "..", "entities");

const config: DataSourceOptions = {
  type: "postgres", // Database type (e.g., postgres, mysql, sqlite)
  host: process.env.DATABASE_HOST, // Database host
  port: Number(process.env.DATABASE_PORT), // Database port
  username: process.env.DATABASE_USERNAME, // Database username
  password: process.env.DATABASE_PASSWORD, // Database password
  database: process.env.DATABASE_NAME, // Database name
  entities: [`${entityPath}/*.{js,ts}`], // Entity files path (you'll need to adjust this)
  synchronize: true, // Automatically sync database schema on application start
  logging: false, // Enable SQL query logging
  ssl: true, // Enable SSL
};

export = config;
