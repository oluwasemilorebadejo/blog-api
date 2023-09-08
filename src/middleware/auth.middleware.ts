import { RequestHandler, Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../entities/user.entity"; // Import your User entity
import { AppError } from "../utils/errors"; // Create an AppError class for custom errors

interface IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;

  save(): Promise<IUser>;
}

interface JWTData extends JwtPayload {
  id: string;
}

// Create a middleware to protect routes
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
      new AppError("You aren't logged in. Kindly log in to get access.", 401)
    );
  }

  // Verify token
  const decoded: string | JwtPayload = jwt.verify(
    token,
    process.env.JWT_SECRET!
  );

  const userId = (decoded as IUser).id;

  // Check if user still exists
  const currentUser = await User.findOneBy({ id: userId });
  if (!currentUser) {
    return next(
      new AppError("The user with this token no longer exists.", 401)
    );
  }

  // Grant access to protected route
  req.body.user = currentUser; // req.body.user stores the user data and is only available on protected routes
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
