import express from "express";
import {
  submitQuiz,
  getStudentAttempts,
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

export default router;
