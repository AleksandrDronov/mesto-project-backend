import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} from "../controllers/users";

const router = Router();

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.get("/me", getCurrentUser);
router.patch("/me", updateUser);
router.patch("/me/avatar", updateUserAvatar);

export default router;
