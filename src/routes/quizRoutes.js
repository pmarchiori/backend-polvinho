import express from "express";
import {
  createQuiz,
  softDeleteQuiz,
  getQuizById,
  updateQuiz,
  getQuizResultsById,
} from "../controllers/quizController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("teacher"), createQuiz);

router.get(
  "/:id/results",
  authenticateToken,
  authorizeRoles("teacher"),
  getQuizResultsById
);

//colocar authenticate e authorize
router.get("/:id", getQuizById);

router.put("/:id", authenticateToken, authorizeRoles("teacher"), updateQuiz);

router.put(
  "/:id/remove",
  authenticateToken,
  authorizeRoles("teacher"),
  softDeleteQuiz
);

export default router;
