import express from "express";
import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  softDeleteSubject,
} from "../controllers/subjectController.js";
import { validateSubject } from "../middleware/validateSubject.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  validateSubject,
  authenticateToken,
  authorizeRoles("admin"),
  createSubject
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "teacher"),
  getAllSubjects
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "teacher", "student"),
  getSubjectById
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  validateSubject,
  updateSubject
);

router.put(
  "/:id/remove",
  authenticateToken,
  authorizeRoles("admin"),
  softDeleteSubject
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteSubject
);

export default router;
