import express from "express";
import {
  createQuestion,
  getAllQuestionsByQuiz,
} from "../controllers/questionController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("teacher"), createQuestion);

router.get("/quiz/:quizId", authenticateToken, getAllQuestionsByQuiz);

export default router;
