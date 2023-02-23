import dotenv from "dotenv";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ISessionRequest } from "../utils/types";
import AuthError from "../errors/auth-err";

dotenv.config();

export default (req: ISessionRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  const { JWT_SECRET = "secret_key" } = process.env;
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
