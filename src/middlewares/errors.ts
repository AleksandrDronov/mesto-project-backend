/* eslint-disable no-unused-vars */
import {
  NextFunction,
  Response,
  Request,
} from "express";

export default (
  err: { message: string, statusCode: number },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(err.statusCode).send({ message: err.message });
};
