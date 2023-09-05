import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../entities/user.entity";

export const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });

export const createSendToken = (
  user: User,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // cant manipulate cookie in any way ie cant delete the cookie
    secure: req.secure,
  };

  res.cookie("jwt", token, cookieOptions);

  // user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
