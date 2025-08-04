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
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  validateUser,
  authenticateToken,
  authorizeRoles("admin"),
  createUser
);

router.get("/", authenticateToken, authorizeRoles("admin"), getAllActiveUsers);

router.get("/all", authenticateToken, authorizeRoles("admin"), getAllUsers);

router.get("/:id", authenticateToken, authorizeRoles("admin"), getUserById);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  validateUser,
  updateUser
);

router.put(
  "/:id/remove",
  authenticateToken,
  authorizeRoles("admin"),
  softDeleteUser
);

router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteUser);

export default router;
