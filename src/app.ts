import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { AppError } from "./utils/errors";
import globalErrorHandler from "./middleware/error.middleware";

import authRouter from "./routes/auth.route";
// import postRouter from "./routes/post.route";

const app = express();

// Log environment variable
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
console.log(`ENVIRONMENT: ${process.env.NODE_ENV}`);

app.use(express.json());

app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRouter);

// route error handler
app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.method} at ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export default app;
