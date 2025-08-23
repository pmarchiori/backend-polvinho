import express from "express";
import { submitQuiz } from "../controllers/answerController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/submit",
  authenticateToken,
  authorizeRoles("student"),
  submitQuiz
);

export default router;
