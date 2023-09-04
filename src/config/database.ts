// import { createConnection, Connection } from "typeorm";
// import path from "path";

// const entityPath = path.resolve(__dirname, "..", "entities");
// console.log(entityPath);

// export default (): Promise<void | Connection> =>
//   createConnection({
//     type: "mysql",
//     ...config.get<object>("database"),
//     entities: [`${entityPath}/*.{js,ts}`],
//     logging: false,
//     synchronize: true,
//   })
//     .then(() => {
//       console.log("Connected to database");
//     })
//     .catch((err) => {
//       console.log("Error connecting to database:", err);
//       process.exit(1);
//     });

// // export default AppDataSource;
