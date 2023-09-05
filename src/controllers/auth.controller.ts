import { Request, Response, NextFunction } from "express";
import { catchAsync, AppError } from "../utils/errors";
import { createSendToken } from "../services/auth.service";
import User from "../entities/user.entity";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;

    // CHECK IF USER ALREADY EXISTS
    const oldUser = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (oldUser)
      return next(new AppError("User already exists. Please login", 409));

    // Ensure password and passwordConfirm match
    if (req.body.password !== req.body.passwordConfirm) {
      return next(new AppError("Passwords dont match", 400));
    }

    const newUser = new User();
    newUser.id = req.body.id;
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    await newUser.save();

    createSendToken(newUser, 201, req, res);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    // check if username or password was entered
    if (!email || !password) {
      return next(new AppError("Please enter email and password", 400));
    }

    // check if user exists and password is correct
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user || !user.correctPassword(password, user.password)) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // if everything is okay, send token to client and login
    createSendToken(user, 200, req, res);
  }
);
