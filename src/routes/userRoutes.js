import express from "express";
import {
  createUser,
  getAllActiveUsers,
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  deleteUser,
} from "../controllers/userController.js";

import { validateUser } from "../middleware/validateUser.js";

const router = express.Router();

router.post("/", validateUser, createUser);
router.get("/", getAllActiveUsers);
router.get("/all", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", validateUser, updateUser);
router.put("/:id/remove", softDeleteUser);
router.delete("/:id", deleteUser);

export default router;
