/* eslint-disable eqeqeq */
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import Card from "../models/card";
import { IRequestWhithUser } from "../utils/types";
import ServerError from "../errors/server-err";
import ValidationError from "../errors/validation-err";
import NotFoundError from "../errors/not-found-err";
import ForbiddenError from "../errors/forbidden-err";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.send(cards))
    .catch(() => next(new ServerError("На сервере произошла ошибка")));
};

export const createCard = (req: IRequestWhithUser, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const userId = req.user?._id;

  Card.create({ name, link, owner: userId })
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
  const userId = req.user?._id;

  Card.findById(cardId).populate<{ owner: { id: string } }>("owner")
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Нет карточки с таким id");
      }
      if (card.owner.id !== userId) {
        throw new ForbiddenError("Чужая карточка");
      }
      card.remove()
        .then((deleteCard) => res.send(deleteCard));
    })
    .catch((err) => {
      if (err instanceof NotFoundError || err instanceof ForbiddenError) {
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
  const userId = req.user?._id;

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
