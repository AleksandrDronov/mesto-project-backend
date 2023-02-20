/* eslint-disable import/no-extraneous-dependencies */
import dotenv from "dotenv";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ISessionRequest } from "../utils/types";

dotenv.config();

// eslint-disable-next-line consistent-return
export default (req: ISessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Необходима авторизация" });
  }

  const token = authorization.replace("Bearer ", "");
  const { JWT_SECRET } = process.env;
  let payload;

  try {
    if (JWT_SECRET) payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: "Необходима авторизация" });
  }

  req.user = payload;

  next();
};
