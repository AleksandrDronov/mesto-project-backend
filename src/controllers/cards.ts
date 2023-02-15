import mongoose from "mongoose";
import { Request, Response } from "express";
import Card from "../models/card";
import { IRequestWhithUser } from "../utils/types";
import NotFoundError from "../errors/not-found-err";

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: "На сервере произошла ошибка" }));
};

export const createCard = (req: IRequestWhithUser, res: Response) => {
  const { name, link } = req.body;
  const id = req.user?._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

export const deleteCardById = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Нет карточки с таким id");
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof NotFoundError && err.statusCode === 404) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(400)
          .send({ message: "Переданный id карточки не валиден" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

export const addLikeById = (req: IRequestWhithUser, res: Response) => {
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
      if (err instanceof NotFoundError && err.statusCode === 404) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(400)
          .send({ message: "Переданный id карточки не валиден" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

export const deleteLikeById = (req: IRequestWhithUser, res: Response) => {
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
      if (err instanceof NotFoundError && err.statusCode === 404) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(400)
          .send({ message: "Переданный id карточки не валиден" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};
