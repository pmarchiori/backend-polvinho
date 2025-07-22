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

const router = express.Router();

router.post("/", validateSubject, createSubject);
router.get("/", getAllSubjects);
router.get("/:id", getSubjectById);
router.put("/:id", validateSubject, updateSubject);
router.put("/:id/remove", softDeleteSubject);
router.delete("/:id", deleteSubject);

export default router;
