/* eslint-disable import/no-extraneous-dependencies */
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IRequestWhithUser extends Request {
  user?: {
    _id: string;
  };
}

export interface ISessionRequest extends Request {
  user?: string | JwtPayload;
}
