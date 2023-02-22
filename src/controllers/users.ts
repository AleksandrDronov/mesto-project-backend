import dotenv from "dotenv";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { IRequestWhithUser } from "../utils/types";
import NotFoundError from "../errors/not-found-err";
import AuthError from "../errors/auth-err";
import ServerError from "../errors/server-err";
import ValidationError from "../errors/validation-err";
import ConflictError from "../errors/conflict-err";

dotenv.config();

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next(new ServerError("На сервере произошла ошибка")));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ValidationError("Переданы некорректные данные"));
      }
      if (err.code === 11000) {
        return next(new ConflictError("Такой email уже используется"));
      }
      return next(new ServerError("На сервере произошла ошибка"));
    });
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError("Переданы некорректные данные"));
      }
      return next(new ServerError("На сервере произошла ошибка"));
    });
};

export const updateUser = (req: IRequestWhithUser, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const id = req.user?._id;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError("Переданы некорректные данные"));
      }
      return next(new ServerError("На сервере произошла ошибка"));
    });
};

export const updateUserAvatar = (req: IRequestWhithUser, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const id = req.user?._id;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError("Переданы некорректные данные"));
      }
      return next(new ServerError("На сервере произошла ошибка"));
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const { JWT_SECRET } = process.env;
      if (JWT_SECRET) {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.cookie("jwt", token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        }).send({ token });
      }
    })
    .catch((err) => {
      if (err instanceof AuthError) {
        return next(err);
      }
      return next(new ServerError("На сервере произошла ошибка"));
    });
};

export const getCurrentUser = (req: IRequestWhithUser, res: Response, next: NextFunction) => {
  const id = req.user?._id;

  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError("Переданы некорректные данные"));
      }
      return next(new ServerError("На сервере произошла ошибка"));
    });
};
