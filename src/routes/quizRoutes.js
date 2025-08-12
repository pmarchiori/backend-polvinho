import express from "express";
import { createQuiz, softDeleteQuiz } from "../controllers/quizController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("teacher"), createQuiz);

router.put(
  "/:id/remove",
  authenticateToken,
  authorizeRoles("teacher"),
  softDeleteQuiz
);

export default router;
