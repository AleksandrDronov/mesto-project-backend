import mongoose from "mongoose";
import { Request, Response } from "express";
import User from "../models/user";
import { IRequestWhithUser } from "../utils/types";
import NotFoundError from "../errors/not-found-err";

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: "На сервере произошла ошибка" }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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
