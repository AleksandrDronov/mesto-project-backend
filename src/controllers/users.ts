import dotenv from "dotenv";
import mongoose from "mongoose";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { IRequestWhithUser } from "../utils/types";
import NotFoundError from "../errors/not-found-err";
import AuthError from "../errors/auth-err";

dotenv.config();

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: "На сервере произошла ошибка" }));
};

export const createUser = (req: Request, res: Response) => {
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
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof NotFoundError && err.statusCode === 404) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(400)
          .send({ message: "Переданный id пользователя не валиден" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

export const updateUser = (req: IRequestWhithUser, res: Response) => {
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
      if (err instanceof NotFoundError && err.statusCode === 404) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(400)
          .send({ message: "Переданный id пользователя не валиден" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

export const updateUserAvatar = (req: IRequestWhithUser, res: Response) => {
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
      if (err instanceof NotFoundError && err.statusCode === 404) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(400)
          .send({ message: "Переданный id пользователя не валиден" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

export const login = (req: Request, res: Response) => {
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
      if (err instanceof AuthError && err.statusCode === 401) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

export const getCurrentUser = (req: IRequestWhithUser, res: Response) => {
  const id = req.user?._id;
  // eslint-disable-next-line no-console
  console.log(id);

  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof NotFoundError && err.statusCode === 404) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(400)
          .send({ message: "Переданный id пользователя не валиден" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};
