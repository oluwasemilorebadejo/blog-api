import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { promisify } from "util";
import User from "../entities/user.entity"; // Import your User entity
import { AppError } from "../utils/errors"; // Create an AppError class for custom errors

export interface IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;

  save(): Promise<IUser>;
}

// Create a middleware to protect routes
export const protect: RequestHandler = async (req, res, next) => {
  // Get the token and check if it exists
  let token: string | undefined;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access.", 401)
    );
  }

  // Verify token
  const decoded: string | JwtPayload = await jwt.verify(
    token,
    process.env.JWT_SECRET!
  );

  const userId = (decoded as IUser).id;

  // Check if the user still exists
  const currentUser = await User.findOne({ where: { id: userId } });

  // Grant access to protected route
  res.locals.user = currentUser;

  next();
};

// Create a middleware to restrict routes based on user roles
export const restrictTo =
  (...roles: string[]): RequestHandler =>
  (req, res, next) => {
    if (!roles.includes(res.locals.user.role)) {
      return next(
        new AppError(
          "Access denied. You are not allowed to perform this operation.",
          403
        )
      );
    }

    next();
  };
