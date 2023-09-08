import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

const handleJWTErr = (err: AppError) =>
  new AppError("invalid token. pls log in again", 401);

const handleJWTExpiredErr = (err: AppError) =>
  new AppError("token expired. kindly log in again", 401);

const sendErrorDev = (err: AppError, req: Request, res: Response) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    // expected errors, send err to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // programming errors, don't send details to client
    console.error("ERROR", err);

    return res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

export default (
  err: any | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "JsonWebTokenError") err = handleJWTErr(err);
    if (err.name === "TokenExpiredError") err = handleJWTExpiredErr(err);
    sendErrorProd(err, req, res);
  }
};
