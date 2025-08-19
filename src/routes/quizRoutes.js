import express from "express";
import {
  createQuiz,
  softDeleteQuiz,
  getQuizById,
  updateQuiz,
} from "../controllers/quizController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("teacher"), createQuiz);

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
