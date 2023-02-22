import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import Card from "../models/card";
import { IRequestWhithUser } from "../utils/types";
import ServerError from "../errors/server-err";
import ValidationError from "../errors/validation-err";
import NotFoundError from "../errors/not-found-err";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.send(cards))
    .catch(() => next(new ServerError("На сервере произошла ошибка")));
};

export const createCard = (req: IRequestWhithUser, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const id = req.user?._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ValidationError("Переданы некорректные данные"));
      }
      return next(new ServerError("На сервере произошла ошибка"));
    });
};

export const deleteCardById = (req: IRequestWhithUser, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const id = req.user?._id;

  Card.findOneAndRemove({ _id: cardId, owner: id })
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Нет карточки с таким id");
      }
      res.send(card);
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

export const addLikeById = (req: IRequestWhithUser, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Нет карточки с таким id");
      }
      res.send(card);
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

export const deleteLikeById = (req: IRequestWhithUser, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = "63f251385dd05c3d13a1608f";

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Нет карточки с таким id");
      }
      res.send(card);
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
