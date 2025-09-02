import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import dotenv from "dotenv";
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ username, password: hashedPassword });

    const payload = { userId: newUser._id };
    const secret = env.JWT_SECRET!;
    const options = { expiresIn: env.JWT_EXP } as jwt.SignOptions;
    const token = jwt.sign(payload, secret, options);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};
