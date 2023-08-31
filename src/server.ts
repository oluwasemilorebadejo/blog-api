import Express, { Request, Response, NextFunction, Application } from "express";
import app from "./app";

app.listen(process.env.PORT, (): void => {
  console.log(`server running on port ${process.env.PORT}`);
});
