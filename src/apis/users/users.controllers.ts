import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
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

    const payload = { userId: newUser._id, username: username };
    const secret = env.JWT_SECRET!;
    const options = { expiresIn: env.JWT_EXP } as jwt.SignOptions;
    const token = jwt.sign(payload, secret, options);
    res.status(201).json({
      username: username,
      password: hashedPassword,
      token: token,
    });
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
    const { username, password } = req.body;

    if (!username || !password) {
      return next({
        status: 400,
        message: "invalid credentials 1",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return next({
        status: 400,
        message: "invalid credentials 2",
      });
    }

    console.log(password, user.password);
    const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
      return next({
        status: 400,
        message: "invalid credentials 3",
      });
    }
    const payload = { userId: user._id, username: username };
    const secret = env.JWT_SECRET!;
    const options = { expiresIn: env.JWT_EXP } as jwt.SignOptions;
    const token = jwt.sign(payload, secret, options);
    res.status(200).json({
      token: token,
    });
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
