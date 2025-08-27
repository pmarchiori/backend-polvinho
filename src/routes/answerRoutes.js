import express from "express";
import {
  submitQuiz,
  getStudentAttempts,
  getAnswerById,
} from "../controllers/answerController.js";
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

router.get(
  "/student/:quizId",
  authenticateToken,
  authorizeRoles("student"),
  getStudentAttempts
);

router.get(
  "/:answerId",
  authenticateToken,
  authorizeRoles("student", "teacher"),
  getAnswerById
);

export default router;
