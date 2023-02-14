import { Request } from "express";

export interface IRequestWhithUser extends Request {
  user?: {
    _id: string;
  };
}
