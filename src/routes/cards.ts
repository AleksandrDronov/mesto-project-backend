import { Router } from "express";
import {
  getCards,
  createCard,
  deleteCardById,
  addLikeById,
  deleteLikeById,
} from "../controllers/cards";

const router = Router();

router.get("/", getCards);
router.delete("/:cardId", deleteCardById);
router.post("/", createCard);
router.put("/:cardId/likes", addLikeById);
router.delete("/:cardId/likes", deleteLikeById);

export default router;
