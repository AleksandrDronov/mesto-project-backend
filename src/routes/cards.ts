/* eslint-disable no-useless-escape */
import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import {
  getCards,
  createCard,
  deleteCardById,
  addLikeById,
  deleteLikeById,
} from "../controllers/cards";

const router = Router();

router.get("/", getCards);

router.delete("/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCardById);

router.post("/", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/),
  }),
}), createCard);

router.put("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), addLikeById);

router.delete("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteLikeById);

export default router;
