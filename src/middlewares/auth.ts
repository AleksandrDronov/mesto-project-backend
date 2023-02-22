import dotenv from "dotenv";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ISessionRequest } from "../utils/types";
import AuthError from "../errors/auth-err";

dotenv.config();

// eslint-disable-next-line consistent-return
export default (req: ISessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new AuthError("Необходима авторизация"));
    return;
  }

  const token = authorization.replace("Bearer ", "");
  const { JWT_SECRET } = process.env;
  let payload;

  try {
    if (JWT_SECRET) payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthError("Необходима авторизация"));
    return;
  }

  req.user = payload;

  next();
};
