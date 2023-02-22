/* eslint-disable no-useless-escape */
import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} from "../controllers/users";

const router = Router();

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);
router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
}), updateUser);
router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/),
  }),
}), updateUserAvatar);

export default router;
